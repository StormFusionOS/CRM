import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'tech' | 'sales' | 'support'>;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = '/dashboard'
}) => {
  const { hasRole } = useAuth();

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
