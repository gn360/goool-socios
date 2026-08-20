import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth, useTheme } from '@goool/sdk';
import type { LucideIcon } from 'lucide-react';
import { User, Mail, Phone, CalendarDays, ShieldCheck, BadgeCheck } from 'lucide-react';
import { LoginForm } from '@/app/features/auth/LoginForm';
import { ForgotPasswordForm } from '@/app/features/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/app/features/auth/ResetPasswordForm';
import { useDashboard } from '@/shared/hooks/useDashboard';

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ingresá tus credenciales para acceder al portal de socios.
        </p>
      </div>

      <LoginForm />

      <div className="text-center">
        <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-brand-primary">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recuperar contraseña</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>
      </div>

      <ForgotPasswordForm />

      <div className="text-center">
        <Link to="/login" className="text-sm text-gray-500 hover:text-brand-primary">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Restablecer contraseña</h2>
        <p className="text-sm text-gray-500 mt-1">
          Ingresá tu nueva contraseña para continuar.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}

export function DashboardPage() {
  const { branding } = useTheme();
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el dashboard.</p>
      </div>
    );
  }

  const familyWidget = data?.widgets?.family;
  const familyCount = familyWidget?.total ?? 0;
  const activeCount = familyWidget?.active ?? 0;

  const shortcuts = [
    { id: 'family', label: 'Mi grupo', path: '/family', icon: '👨‍👩‍👧‍👦', badge: familyCount > 0 ? `${activeCount}/${familyCount}` : null },
    { id: 'memberships', label: 'Mis membresías', path: '/memberships', icon: '🪪' },
    { id: 'payments', label: 'Mis pagos', path: '/payments', icon: '💳' },
    { id: 'profile', label: 'Mi perfil', path: '/profile', icon: '👤' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user ? `¡Hola, ${user.name}!` : 'Dashboard'}
        </h1>
        {familyCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {familyCount} {familyCount === 1 ? 'miembro' : 'miembros'} en tu grupo
          </p>
        )}
      </div>

      {/* Club branding banner */}
      {branding && (
        <div
          className="rounded-xl p-6 text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="flex items-center gap-4">
            {branding.logo && (
              <img
                src={branding.logo}
                alt="Logo del club"
                className="h-16 w-16 rounded-xl object-cover bg-white/10 p-1"
              />
            )}
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: 'var(--color-primary-text)' }}
              >
                Tu club
              </h2>
              <p
                className="text-sm mt-1 opacity-80"
                style={{ color: 'var(--color-primary-text)' }}
              >
                Bienvenido al portal de socios
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.id}
            to={shortcut.path}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)] hover:shadow-sm transition-all flex items-center gap-4"
          >
            <span className="text-2xl">{shortcut.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{shortcut.label}</h3>
                {shortcut.badge && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-text)' }}>
                    {shortcut.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                Gestionar {shortcut.label.toLowerCase()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  const initials = `${user.name.charAt(0)}${user.last_name ? user.last_name.charAt(0) : ''}`.toUpperCase();

  const memberSince = new Date(user.created_at).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const statusConfig = {
    active: { label: 'Activo', className: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactivo', className: 'bg-gray-100 text-gray-600' },
    suspended: { label: 'Suspendido', className: 'bg-red-100 text-red-700' },
  } as const;

  const status = statusConfig[user.status];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Tus datos personales y de cuenta</p>
      </div>

      {/* Identity card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
        {user.avatar ? (
          <img src={user.avatar} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {user.name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
          <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Personal data */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Datos personales</h3>
        <dl className="mt-4 space-y-4">
          <ProfileField icon={User} label="Nombre">
            {user.name}
          </ProfileField>
          <ProfileField icon={User} label="Apellido">
            {user.last_name}
          </ProfileField>
          <ProfileField icon={Mail} label="Email">
            {user.email}
          </ProfileField>
          <ProfileField icon={Phone} label="Teléfono">
            {user.phone ?? '—'}
          </ProfileField>
        </dl>
      </section>

      {/* Account */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Cuenta</h3>
        <dl className="mt-4 space-y-4">
          <ProfileField icon={BadgeCheck} label="Verificación de email">
            {user.email_verified_at ? 'Verificado' : 'Pendiente de verificación'}
          </ProfileField>
          <ProfileField icon={CalendarDays} label="Miembro desde">
            {memberSince}
          </ProfileField>
          <ProfileField icon={ShieldCheck} label="Estado de la cuenta">
            {status.label}
          </ProfileField>
        </dl>
      </section>
    </div>
  );
}

function ProfileField({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
      <div className="flex-1 min-w-0">
        <dt className="text-xs text-gray-500">{label}</dt>
        <dd className="text-sm font-medium text-gray-900 mt-0.5 break-words">{children}</dd>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Página no encontrada</h2>
      <p className="text-gray-500 mb-6">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        to="/dashboard"
        className="bg-brand-primary text-brand-primary-text font-semibold rounded-full px-6 py-2 text-sm hover:bg-brand-secondary hover:text-brand-secondary-text transition-colors"
      >
        Volver al dashboard
      </Link>
    </div>
  );
}
