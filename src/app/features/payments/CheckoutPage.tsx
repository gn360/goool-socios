import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PaymentAmount, useChargePayment, Button } from '@goool/sdk';
import { CreditCard } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

/**
 * Real checkout: the member pays their membership plan amount with one of
 * their saved payment methods. On success it navigates to the confirmation
 * page with the attempt uuid.
 */
export function CheckoutPage() {
  const { client, payments } = useSociosApi();
  const navigate = useNavigate();
  const charge = useChargePayment(client, 'socios');

  const overview = useQuery({
    queryKey: ['membership-overview'],
    queryFn: () => payments.getMembershipOverview(),
  });
  const methods = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => payments.listPaymentMethods(),
  });

  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [error, setError] = useState('');

  if (overview.isLoading || methods.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (overview.error || methods.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el checkout.</p>
      </div>
    );
  }

  const membership = overview.data?.membership ?? null;
  const methodList = methods.data ?? [];
  const amount = membership?.plan?.amount ?? 0;

  if (!membership) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tenés una membresía activa.</p>
          <p className="text-xs text-gray-400 mt-1">Cuando el club te asigne un plan, vas a poder pagarlo acá.</p>
          <Link to="/memberships" className="inline-block mt-4 text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
            Ver mi membresía
          </Link>
        </div>
      </div>
    );
  }

  if (amount <= 0) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="bg-white border rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">Tu plan no requiere pago.</p>
        </div>
      </div>
    );
  }

  const selectedMethodId = paymentMethodId || String(methodList.find((m) => m.is_default)?.id ?? '');

  const handlePay = async () => {
    setError('');

    if (!selectedMethodId) {
      setError('Seleccioná un método de pago para continuar.');
      return;
    }

    try {
      const result = await charge.mutateAsync({
        payment_method_id: Number(selectedMethodId),
        amount,
        currency: 'UYU',
        idempotency_key: crypto.randomUUID(),
        membership_id: membership.id,
      });

      if (result.success && result.payment_attempt_uuid) {
        navigate(`/payment/confirmation?attempt=${result.payment_attempt_uuid}`);
        return;
      }

      setError(result.error_message ?? 'El pago no se pudo procesar.');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Error al procesar el pago. Intentá nuevamente.',
      );
    }
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Confirmá tu pago</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Membresía</span>
          <span className="font-medium text-gray-900">{membership.plan?.title ?? 'Plan'}</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-3">
          <span className="text-gray-500">Total</span>
          <span className="font-bold text-gray-900"><PaymentAmount amountCents={amount} /></span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
          {methodList.length > 0 ? (
            <select
              value={selectedMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              {methodList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.display_number}
                  {m.is_default ? ' (default)' : ''}
                  {m.is_expired ? ' (vencida)' : ''}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-gray-500">
              No tenés métodos de pago. <Link to="/payment-methods" className="font-medium" style={{ color: 'var(--color-primary)' }}>Agregá una tarjeta</Link> para pagar.
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2">
            <span>{error}</span>
          </div>
        )}

        <Button
          type="button"
          variant="primary"
          className="w-full"
          loading={charge.isPending}
          disabled={methodList.length === 0}
          onClick={handlePay}
        >
          Pagar ahora
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Pago seguro procesado por FacturaExpress
        </p>
      </div>
    </div>
  );
}
