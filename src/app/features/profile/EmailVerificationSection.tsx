import { useState } from 'react';
import { useAuth, Button } from '@goool/sdk';
import { BadgeCheck, MailWarning } from 'lucide-react';

/**
 * Email verification status and resend action.
 *
 * Shows a warning banner with a "resend" button while the email is
 * unverified; renders a simple verified badge otherwise.
 */
export function EmailVerificationSection() {
  const { user, resendVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (user?.email_verified_at) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-700">
        <BadgeCheck className="w-4 h-4" />
        <span>Email verificado</span>
      </div>
    );
  }

  const handleResend = async () => {
    setSending(true);
    setMessage(null);

    try {
      await resendVerification();
      setMessage({
        type: 'success',
        text: 'Correo de verificación reenviado. Revisá tu bandeja de entrada.',
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'No se pudo reenviar el correo. Intentá nuevamente.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <MailWarning className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-800">Tu email todavía no está verificado.</p>
          <p className="text-xs text-amber-700 mt-1">
            Verificá tu correo para asegurar el acceso a tu cuenta.
          </p>
          <div className="mt-3">
            <Button
              type="button"
              variant="secondary-outline"
              size="sm"
              onClick={handleResend}
              loading={sending}
            >
              Reenviar verificación
            </Button>
          </div>
          {message && (
            <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
