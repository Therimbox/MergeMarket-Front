// src/api.js
// Centraliza la URL base de la API usando variable de entorno VITE_API_URL
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://84.246.213.41:8080',
});

export default api;
