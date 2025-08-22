import axios from 'axios';

// configuration de axios pour envoyer les cookies au serveur
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
  withCredentials: true, // IMPORTANT pour envoyer les cookies httpOnly dans les requêtes cross-origin
});

export default axiosClient;