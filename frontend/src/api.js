import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

// Add token to requests
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-handle 401 — logout and reload (so UI shows login)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      // optional: show message
      alert("Session expired or invalid token. Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
