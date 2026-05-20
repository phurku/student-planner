import axios from 'axios';
import { API_BASE_URL } from './config';

const API = axios.create({
    baseURL: API_BASE_URL,
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