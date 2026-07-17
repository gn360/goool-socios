import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '@goool/sdk';

interface PermissionGuardProps {
  permission: string;
  fallbackPath?: string;
}

export function PermissionGuard({ permission, fallbackPath = '/dashboard' }: PermissionGuardProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <Outlet />;
}
