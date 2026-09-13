import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const getBaseUrl = () => {
  if (configuredApiUrl) {
    const cleanUrl = configuredApiUrl.replace(/\/+$/, "");
    return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }

  // Production default
  return "/api";
};

const API = axios.create({
  baseURL: getBaseUrl(),
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
