import { Outlet } from 'react-router-dom';
import { useAuth } from '@goool/sdk';
import { Button } from '@goool/sdk';
import { LogOut } from 'lucide-react';

export function AuthLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-brand-primary">Goool Socios</span>
              <span className="text-sm text-gray-500 hidden sm:inline">
                | Portal de socios
              </span>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-brand-primary font-semibold text-xs">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span>{user.name}</span>
                </div>
              )}

              <Button variant="secondary-outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Goool Socios. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
