import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@goool/sdk';

export function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
