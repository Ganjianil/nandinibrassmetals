import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nandinibrassmetals.onrender.com',
    withCredentials: true, // Automatically sends cookies with every request
});

export default api;