import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
// Suppression import direct axios classique, on utilise axiosClient
// import axios from 'axios';
import axiosClient from '../axiosClient';

type LoginResponse = {
  // Le backend ne renverra plus le token JWT en JSON ( mais il l'envoi maintenant dans le cookie)
  userId: string;
  role: 'admin' | 'manager' | 'customer';
};

type User = {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'customer';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

/* -- J'ai supprimer du token localStorage au démarrage -- */
// const token = localStorage.getItem('token');

// let initialUser: User | null = null;
// let initialAuth = false;

// if (token) {
//   try {
//     const decoded = JSON.parse(atob(token.split('.')[1]));
//     initialUser = {
//       id: decoded.sub || decoded.userId,
//       email: decoded.email,
//       role: decoded.role,
//     };
//     initialAuth = true;
//   } catch (error) {
//     console.error('Invalid token', error);
//     localStorage.removeItem('token');
//   }
// }

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Init user et isAuthenticated vides, on récupère user après login ou session existante
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login : appel /sessions avec axiosClient, JWT sera en cookie httpOnly
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosClient.post<LoginResponse>('/sessions', { email, password });

      // JWT est dans cookie httpOnly, pas dans response.data.token
      // Récupérons le profil utilisateur pour remplir le contexte
      const profileResponse = await axiosClient.get('/users/profile');
      const profile = profileResponse.data;

      const userData: User = {
        id: profile.id_user,
        email: profile.email,
        role: profile.user_role,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout : appel API et reset context utilisateur
  const logout = async () => {
    await axiosClient.delete('/sessions');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
