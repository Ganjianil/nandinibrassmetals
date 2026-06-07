import axios from "axios";

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
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
