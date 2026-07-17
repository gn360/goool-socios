import { Navigate, Outlet } from 'react-router-dom';
import { useRoles } from '@goool/sdk';

interface RoleGuardProps {
  role: string;
  fallbackPath?: string;
}

export function RoleGuard({ role, fallbackPath = '/dashboard' }: RoleGuardProps) {
  const { hasRole } = useRoles();

  if (!hasRole(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
