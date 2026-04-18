import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = window.__authToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expired — go back to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.__authToken = null;
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;