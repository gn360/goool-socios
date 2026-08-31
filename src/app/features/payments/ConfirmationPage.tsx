import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PaymentAmount, Button } from '@goool/sdk';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

const TERMINAL_STATUSES = ['succeeded', 'failed', 'rejected', 'refunded'];

/**
 * Payment confirmation: reads the attempt by uuid and polls while it is
 * pending/processing. Terminal states render success/failure views.
 */
export function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const attemptUuid = searchParams.get('attempt');
  const { payments } = useSociosApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-attempt-detail', attemptUuid],
    queryFn: () => payments.getPaymentAttempt(attemptUuid!),
    enabled: Boolean(attemptUuid),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL_STATUSES.includes(status) ? false : 2000;
    },
  });

  if (!attemptUuid) {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <p className="text-sm text-gray-500">No hay un pago para confirmar.</p>
        <Link to="/payments" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
          Ver historial de pagos
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto" />
        <p className="text-sm text-gray-500">Consultando el estado del pago…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">No pudimos consultar el estado del pago.</p>
      </div>
    );
  }

  const status = data?.status;

  if (status === 'succeeded') {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Pago exitoso!</h1>
          <p className="text-sm text-gray-500 mt-1">Tu pago fue procesado correctamente.</p>
        </div>
        {data && (
          <p className="text-xl font-bold text-gray-900">
            <PaymentAmount amountCents={data.amount_total} currency={data.currency} />
          </p>
        )}
        <Link to="/payments" className="inline-block text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
          Ver historial de pagos
        </Link>
      </div>
    );
  }

  if (status === 'failed' || status === 'rejected') {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">El pago no se pudo procesar</h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.error_message ?? 'Tu banco rechazó el pago. Verificá tus datos e intentá nuevamente.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button type="button" variant="primary" onClick={() => navigate('/checkout')}>
            <ArrowLeft className="w-4 h-4" />
            Reintentar
          </Button>
          <Link to="/payments" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
            Ver historial
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'refunded') {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pago reembolsado</h1>
          <p className="text-sm text-gray-500 mt-1">Este pago fue reembolsado.</p>
        </div>
        <Link to="/payments" className="inline-block text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
          Ver historial de pagos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
        <Clock className="w-8 h-8 text-amber-500" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Procesando tu pago…</h1>
        <p className="text-sm text-gray-500 mt-1">Estamos confirmando la transacción con el proveedor.</p>
      </div>
      <p className="text-xs text-gray-400">Esta página se actualiza sola.</p>
    </div>
  );
}
