import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nandinibrassmetals-1.onrender.com',
    withCredentials: true, // Automatically sends cookies with every request
});

export default api;