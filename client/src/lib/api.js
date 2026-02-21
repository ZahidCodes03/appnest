import axios from 'axios'

const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
    timeout: 30000 // 30 seconds timeout to handle cold starts
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('appnest_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle responses and Retry logic
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const { config, response } = err

        // Handle 401 responses
        if (response?.status === 401) {
            localStorage.removeItem('appnest_token')
            localStorage.removeItem('appnest_user')
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
            }
            return Promise.reject(err)
        }

        // Retry logic for cold starts or network errors (server errors 5xx or no response)
        const shouldRetry = !response || (response.status >= 500 && response.status <= 599)

        if (shouldRetry && (!config._retryCount || config._retryCount < 3)) {
            config._retryCount = (config._retryCount || 0) + 1
            console.warn(`Retrying request (${config._retryCount}/3): ${config.url}`)

            // Wait before retrying (simple backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * config._retryCount))
            return api(config)
        }

        return Promise.reject(err)
    }
)

export default api
