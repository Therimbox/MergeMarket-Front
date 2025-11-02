// src/api.js
// Centraliza la URL base de la API usando variable de entorno VITE_API_URL
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

export default api;
