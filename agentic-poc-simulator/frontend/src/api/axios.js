import axios from 'axios';

const api = axios.create({
    baseURL: '/api/v1', // The proxy will handle the full URL
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api; 