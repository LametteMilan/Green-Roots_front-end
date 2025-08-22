import { useAuth } from '../../contexts/AuthContext';
import { useState, forwardRef } from 'react';
import { login as apiLogin } from '../../services/authService';
import './Login.scss';
import { AxiosError } from 'axios';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login = forwardRef<HTMLDivElement, LoginProps>(({ onSuccess }, ref) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await apiLogin(email, password);
      console.log('Réponse connexion:', response); // <-- Ajoutez ce log
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Détails erreur:', {
          message: err.message,
          response: err.response?.data,
        });
      } else if (err instanceof Error) {
        console.error('Erreur:', err.message);
      } else {
        console.error('Erreur inconnue', err);
      }

      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" ref={ref}>
      <button 
        type="button"
        className="close-button"
        onClick={() => onSuccess?.()}
        aria-label="Fermer"
      >
        &times;
      </button>
      
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Connexion</h2>
        
        {error && (
          <div className="error-message">
            <span role="alert">{error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby={error ? "email-error" : undefined}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby={error ? "password-error" : undefined}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
});

Login.displayName = 'Login';