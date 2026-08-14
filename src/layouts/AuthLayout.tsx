import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth, useTheme } from '@goool/sdk';
import { Button } from '@goool/sdk';
import { LogOut, Menu, X, LayoutDashboard, Users, CreditCard, Receipt, User } from 'lucide-react';
import { APP_NAME } from '@/config/app';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/family', label: 'Mi grupo', icon: Users },
  { to: '/memberships', label: 'Membresías', icon: CreditCard },
  { to: '/payments', label: 'Pagos', icon: Receipt },
  { to: '/profile', label: 'Mi perfil', icon: User },
];

export function AuthLayout() {
  const { user, logout } = useAuth();
  const { branding } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clubName = branding?.logo ? undefined : APP_NAME;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            {APP_NAME}
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: 'var(--color-primary)' } : undefined
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
      <header
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-text)',
          borderColor: 'rgba(255,255,255,0.15)',
        }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 -ml-1 rounded"
              >
                <Menu className="w-5 h-5" />
              </button>
              {branding?.logo ? (
                <img
                  src={branding.logo}
                  alt="Club logo"
                  className="h-8 w-8 rounded object-cover hidden sm:block"
                />
              ) : (
                <span className="text-lg font-bold hidden sm:inline">{clubName}</span>
              )}
              <span className="text-sm opacity-80 lg:hidden">Portal de socios</span>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:flex items-center gap-2 text-sm opacity-90">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <span className="font-semibold text-xs">
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
        <div className="px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.
        </div>
      </footer>
      </div>
    </div>
  );
}
