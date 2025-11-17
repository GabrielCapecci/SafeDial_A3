// frontend/src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:3001"; // API pública
const ADMIN_BASE_URL = "http://localhost:3002"; // API admin

// API pública usada pelo App.jsx (consulta + report)
export const api = axios.create({
  baseURL: BASE_URL
});

// API administrativa usada pelo painel admin
export const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL
});

// Intercepta e adiciona o token do admin automaticamente
adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 Compatibilidade para seu App.jsx que usa "publicApi"
export const publicApi = api;

// ✅ Export default para App.jsx
export default api;
