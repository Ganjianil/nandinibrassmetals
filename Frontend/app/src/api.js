import axios from 'axios';

const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocalHost
    ? "http://localhost:5000"
    : "https://nandinibrassmetals.vercel.app");

const api = axios.create({
    baseURL,
    withCredentials: true, // Automatically sends cookies with every request
});

export default api;