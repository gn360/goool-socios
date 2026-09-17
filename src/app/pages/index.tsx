import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useTheme, useSociosDashboard, PaymentAmount } from '@goool/sdk';
import type { LucideIcon } from 'lucide-react';
import { Users, CreditCard, Receipt, CalendarDays } from 'lucide-react';
import { LoginForm } from '@/app/features/auth/LoginForm';
import { ForgotPasswordForm } from '@/app/features/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/app/features/auth/ResetPasswordForm';
import { useSociosApi } from '@/providers/SociosProvider';

export function LoginPage() {
  const location = useLocation();
  const passwordChanged = (location.state as { passwordChanged?: boolean } | null)?.passwordChanged;

  return (
    <div className="space-y-6">
      {passwordChanged && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Contraseña actualizada. Volvé a iniciar sesión con tu nueva contraseña.</span>
        </div>
      )}

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
  const { client } = useSociosApi();
  const { data, isLoading, error } = useSociosDashboard(client, 'socios');

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

  const family = data?.widgets.family;
  const membership = data?.widgets.membership.membership;
  const payments = data?.widgets.payments;
  const nextCharge = data?.widgets.next_charge.charge;

  const familyCount = family?.total ?? 0;
  const activeCount = family?.active ?? 0;
  const failedRecent = payments?.failed_recent ?? 0;

  const shortcuts = [
    { id: 'profile', label: 'Mi perfil', path: '/profile', icon: '👤', badge: null },
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

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DashboardWidgetCard
          title="Mi grupo"
          icon={Users}
          footer={
            <Link to="/family" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              Gestionar grupo
            </Link>
          }
        >
          {familyCount > 0 ? (
            <p className="text-sm text-gray-600">
              {familyCount} {familyCount === 1 ? 'miembro' : 'miembros'} · {activeCount} {activeCount === 1 ? 'activo' : 'activos'}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Todavía no tenés grupo familiar.</p>
          )}
        </DashboardWidgetCard>

        <DashboardWidgetCard
          title="Membresía"
          icon={CreditCard}
          footer={
            <Link to="/memberships" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              Ver membresía
            </Link>
          }
        >
          {membership ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-900">{membership.plan?.title ?? 'Plan'}</p>
                <StatusPill status={membership.status} />
              </div>
              <p className="text-sm text-gray-600">
                <PaymentAmount amountCents={membership.plan?.amount ?? 0} />
                {membership.plan?.recurrence ? ` · ${recurrenceLabel(membership.plan.recurrence)}` : ''}
              </p>
              {membership.date_end && (
                <p className="text-xs text-gray-500">Vigente hasta {formatDate(membership.date_end)}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Sin membresía activa.</p>
          )}
        </DashboardWidgetCard>

        <DashboardWidgetCard
          title="Próximo cobro"
          icon={CalendarDays}
          footer={
            <Link to="/recurring-payments" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              Gestionar suscripción
            </Link>
          }
        >
          {nextCharge ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">
                <PaymentAmount amountCents={nextCharge.amount} currency={nextCharge.currency} />
              </p>
              <p className="text-xs text-gray-500">{formatDate(nextCharge.next_due_at)}</p>
              {nextCharge.payment_method && (
                <p className="text-xs text-gray-500 capitalize">
                  {nextCharge.payment_method.brand} •••• {nextCharge.payment_method.last_four}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No tenés cobros programados.</p>
          )}
        </DashboardWidgetCard>

        <DashboardWidgetCard
          title="Pagos"
          icon={Receipt}
          footer={
            <Link to="/payments" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              Ver pagos
            </Link>
          }
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              Este mes: <PaymentAmount amountCents={payments?.month_amount ?? 0} />
            </p>
            {payments?.last_payment ? (
              <p className="text-xs text-gray-500">Último cobro: {formatDate(payments.last_payment.created_at)}</p>
            ) : (
              <p className="text-xs text-gray-500">Sin movimientos este mes.</p>
            )}
            {failedRecent > 0 && (
              <p className="text-xs font-medium text-red-600">
                {failedRecent} {failedRecent === 1 ? 'cobro fallido reciente' : 'cobros fallidos recientes'}
              </p>
            )}
          </div>
        </DashboardWidgetCard>
      </div>

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

function DashboardWidgetCard({ title, icon: Icon, children, footer }: { title: string; icon: LucideIcon; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
      {footer}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: 'Activa', className: 'bg-green-100 text-green-700' },
    suspended: { label: 'Suspendida', className: 'bg-red-100 text-red-700' },
    expired: { label: 'Vencida', className: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'Cancelada', className: 'bg-gray-100 text-gray-600' },
  };
  const resolved = config[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };

  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${resolved.className}`}>
      {resolved.label}
    </span>
  );
}

function recurrenceLabel(recurrence: string): string {
  const config: Record<string, string> = {
    monthly: 'mensual',
    quarterly: 'trimestral',
    semester: 'semestral',
    yearly: 'anual',
  };

  return config[recurrence] ?? recurrence;
}

function formatDate(value: string): string {
  const [year, month, day] = (value.split('T')[0] ?? '').split('-');

  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
