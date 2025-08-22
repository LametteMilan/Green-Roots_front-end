import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

type LoginResponse = {
  token: string;
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
  login: (email: string, password: string) => Promise<{ token: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// 🔐 Initialisation synchronisée à partir du token localStorage
const token = localStorage.getItem('token');

let initialUser: User | null = null;
let initialAuth = false;

if (token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    initialUser = {
      id: decoded.sub || decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    initialAuth = true;
  } catch (error) {
    console.error('Invalid token', error);
    localStorage.removeItem('token'); // Nettoie le localStorage si erreur
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>('/sessions', { email, password });
      const { token, userId, role } = response.data;

      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userData: User = {
        id: decoded.sub || decoded.userId || userId,
        email: decoded.email || email,
        role: decoded.role || role,
      };

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);

      return { token };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
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
