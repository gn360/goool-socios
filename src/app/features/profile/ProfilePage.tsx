import { useState } from 'react';
import type { ReactNode } from 'react';
import type { SociosProfileUpdateInput } from '@goool/sdk';
import { useAuth, useSociosProfile, useUpdateSociosProfile } from '@goool/sdk';
import type { LucideIcon } from 'lucide-react';
import { Mail, Phone, CalendarDays, ShieldCheck, FileText } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';
import { ProfileForm } from './ProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { EmailVerificationSection } from './EmailVerificationSection';

/**
 * Interactive member profile: editable basic data, read-only document
 * data, password change and email verification actions.
 */
export function ProfilePage() {
  const { user: authUser, isLoading: authLoading, refreshUser } = useAuth();
  const { client } = useSociosApi();
  const { data: profile, isLoading: profileLoading, error: profileError } = useSociosProfile(client, 'socios');
  const updateProfile = useUpdateSociosProfile(client, 'socios');
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el perfil.</p>
      </div>
    );
  }

  const user = profile?.user ?? authUser;

  if (!user) {
    return null;
  }

  const handleSave = async (input: SociosProfileUpdateInput) => {
    setSaveError('');
    setSaveSuccess(false);

    try {
      await updateProfile.mutateAsync(input);
      await refreshUser();
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'No se pudieron guardar los cambios. Intentá nuevamente.',
      );
    }
  };

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

  const status = statusConfig[user.status] ?? { label: user.status, className: 'bg-gray-100 text-gray-600' };

  const person = profile?.person ?? null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Datos personales</h3>

        <ProfileForm profile={{ user, person }} isSubmitting={updateProfile.isPending} onSubmit={handleSave} />

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
            Perfil actualizado correctamente.
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {saveError}
          </div>
        )}

        <dl className="pt-2 border-t border-gray-100 space-y-4">
          <ProfileField icon={FileText} label="Documento">
            {person?.document_number_masked
              ? `${person.document_type ?? ''} ${person.document_number_masked}`.trim()
              : '—'}
          </ProfileField>
          <ProfileField icon={CalendarDays} label="Fecha de nacimiento">
            {person?.birth_date ?? '—'}
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
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Cuenta</h3>

        <EmailVerificationSection />

        <dl className="pt-2 border-t border-gray-100 space-y-4">
          <ProfileField icon={CalendarDays} label="Miembro desde">
            {memberSince}
          </ProfileField>
          <ProfileField icon={ShieldCheck} label="Estado de la cuenta">
            {status.label}
          </ProfileField>
        </dl>
      </section>

      {/* Password */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Cambiar contraseña</h3>
        <ChangePasswordForm />
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
