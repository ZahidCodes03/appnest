export const getImageUrl = (url) => {
    if (!url) return null;

    // If it's already a full external URL (e.g., Unsplash), return as is
    if (url.startsWith('http') && !url.includes('localhost')) return url;

    // Handle localhost URLs stored in the DB (standardize them)
    if (url.includes('localhost')) {
        const parts = url.split('/uploads/');
        if (parts[1]) url = `/uploads/${parts[1]}`;
    }

    // Prefix with VITE_API_URL if it's a relative path
    if (url.startsWith('/uploads/')) {
        const backendUrl = import.meta.env.VITE_API_URL || '';
        // Remove trailing slash from backendUrl if present, though standard is without
        const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
        return `${cleanBackendUrl}${url}`;
    }

    return url;
};
