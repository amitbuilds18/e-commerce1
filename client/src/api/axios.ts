import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const normalizedApiUrl = configuredApiUrl
  ? configuredApiUrl.replace(/\/+$/, "").endsWith("/api")
    ? configuredApiUrl.replace(/\/+$/, "")
    : `${configuredApiUrl.replace(/\/+$/, "")}/api`
  : undefined;

const fallbackApiUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : typeof window !== "undefined"
    ? `${window.location.origin}/api`
    : "http://localhost:5000/api";

const API = axios.create({
  baseURL: normalizedApiUrl || fallbackApiUrl,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;

