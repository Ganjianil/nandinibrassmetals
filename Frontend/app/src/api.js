import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, // Automatically sends cookies with every request
});

export default api;