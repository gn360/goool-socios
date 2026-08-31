import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth, Button, InputField } from '@goool/sdk';
import { Lock } from 'lucide-react';
import { changePasswordSchema, type ChangePasswordFormData } from './schemas';

/**
 * Password change form for the member's own account.
 *
 * On success the backend revokes all tokens and the SDK clears the session,
 * so the member is redirected to /login with a confirmation banner.
 */
export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
  } = useForm<ChangePasswordFormData>();

  const onFormSubmit = (data: ChangePasswordFormData) => {
    const result = changePasswordSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ChangePasswordFormData;

        setFieldError(path, { type: 'manual', message: issue.message });
      }
      return;
    }

    setSubmitting(true);
    setError('');

    changePassword(result.data)
      .then(() => {
        // The session was revoked server-side and cleared in the SDK.
        // Redirect to login with a confirmation banner once the guard
        // has settled.
        window.setTimeout(() => {
          navigate('/login', { replace: true, state: { passwordChanged: true } });
        }, 1400);
      })
      .catch((err: unknown) => {
        setError(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'No se pudo actualizar la contraseña. Verificá la contraseña actual.',
        );
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <InputField
        label="Contraseña actual"
        type="password"
        {...register('current_password')}
        error={errors.current_password?.message}
        icon={Lock}
        placeholder="••••••••"
        autoComplete="current-password"
        disabled={submitting}
      />

      <InputField
        label="Nueva contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        icon={Lock}
        placeholder="••••••••"
        autoComplete="new-password"
        disabled={submitting}
      />

      <InputField
        label="Confirmar nueva contraseña"
        type="password"
        {...register('password_confirmation')}
        error={errors.password_confirmation?.message}
        icon={Lock}
        placeholder="••••••••"
        autoComplete="new-password"
        disabled={submitting}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end">
        <Button type="submit" variant="secondary-outline" loading={submitting}>
          Cambiar contraseña
        </Button>
      </div>
    </form>
  );
}
