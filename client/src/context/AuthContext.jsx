import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('appnest_token')
        const savedUser = localStorage.getItem('appnest_user')
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch { /* ignore */ }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        const { token, user: userData } = res.data
        localStorage.setItem('appnest_token', token)
        localStorage.setItem('appnest_user', JSON.stringify(userData))
        setUser(userData)
        return userData
    }

    const logout = () => {
        localStorage.removeItem('appnest_token')
        localStorage.removeItem('appnest_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
