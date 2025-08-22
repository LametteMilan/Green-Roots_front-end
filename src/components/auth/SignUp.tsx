import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Suppression de l'import axios 
// import axios from 'axios'; 
import axiosClient from '../../axiosClient';
import { useAuth } from '../../contexts/AuthContext';
import { useCsrfToken } from '../../hooks/useCsrfToken'; 
import './SignUp.scss';

interface SignUpProps {
  onSuccess?: () => void;
}

export const SignUp = ({ onSuccess }: SignUpProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    street: '',
    zip_code: '',
    country: '',
    city: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Récupération du token CSRF (ne modifie pas ta logique)
  const csrfToken = useCsrfToken();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!csrfToken) throw new Error('Token CSRF non disponible');

      if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      if (formData.password.length < 8) {
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      // appel POST via axiosClient et ajout header csrf
      await axiosClient.post('/users', formData, {
        headers: {
          'x-csrf-token': csrfToken,
        },
      });

      await login(formData.email, formData.password);
      onSuccess?.();

      navigate('/');
    } catch (err: any) {
      console.error('Signup failed:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Créer un compte</h2>
        {error && (
          <div className="error-message">
            <span role="alert">{error}</span>
          </div>
        )}
        <div className="form-section">
          <h3>Informations personnelles</h3>
          <div className="form-group">
            <label htmlFor="first_name">Prénom*</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Nom*</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Informations de connexion</h3>
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe* (8 caractères minimum)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Adresse</h3>
          <div className="form-group">
            <label htmlFor="street">Rue*</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="zip_code">Code postal*</label>
            <input
              type="number"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Ville*</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Pays*</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};
