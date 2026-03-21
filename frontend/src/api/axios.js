import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const stored = localStorage.getItem("fittrackUser");
  if (stored) {
    const user = JSON.parse(stored);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

// Global response error handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fittrackUser");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
