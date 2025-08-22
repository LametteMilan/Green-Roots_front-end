import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type UserRole = 'admin' | 'manager' | 'customer';

export const ProtectedRoute = ({ roles }: { roles?: UserRole[] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  
  const hasRequiredRole = user?.role && roles ? roles.includes(user.role) : true;
  
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" state={{ missingRoles: roles }} />;
  }

  return <Outlet />;
};