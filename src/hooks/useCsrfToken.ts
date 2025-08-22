import { useState, useEffect } from 'react';
import axiosClient from '../axiosClient';

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axiosClient.get('/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Erreur lors de la récupération du token CSRF:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  return csrfToken;
};