import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/', // Base URL for your backend
});

// Add a request interceptor to include the token in headers only for authenticated requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    // Exclude Authorization header for registration and login endpoints
    if (token && !config.url.includes('users/') && !config.url.includes('login/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;