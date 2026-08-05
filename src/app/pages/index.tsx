import { Link } from 'react-router-dom';
import { LoginForm } from '@/app/features/auth/LoginForm';
import { ForgotPasswordForm } from '@/app/features/auth/ForgotPasswordForm';

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

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
        <p className="text-sm text-gray-500">Tu dashboard personalizado estará disponible próximamente.</p>
        <p className="text-xs text-gray-400 mt-1">
          Estamos preparando la experiencia para socios.
        </p>
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
