import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@goool/sdk';
import { Button, InputField } from '@goool/sdk';
import { Mail, Send } from 'lucide-react';

export function ForgotPasswordForm() {
  const { authService } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) { setError('El email es obligatorio.'); return; }

    setLoading(true);
    try {
      await authService.forgotPassword({ email: email.trim() });
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Error al enviar el enlace de recuperación.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">¡Email enviado!</h3>
        <p className="text-sm text-gray-600">
          Si el email está registrado, recibirás un enlace para restablecer tu contraseña.
        </p>
         <Link to="/login" className="inline-block text-sm font-medium text-brand-primary hover:text-brand-secondary">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
        placeholder="tu@email.com"
        autoComplete="email"
        disabled={loading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        <Send className="w-4 h-4" />
        Enviar enlace
      </Button>
    </form>
  );
}
