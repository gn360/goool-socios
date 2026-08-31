import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentStatusBadge, PaymentAmount } from '@goool/sdk';
import { X } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

export function PaymentHistoryPage() {
  const { payments } = useSociosApi();
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-attempts'],
    queryFn: () => payments.listPaymentAttempts(),
  });

  const detail = useQuery({
    queryKey: ['payment-attempt-detail', selectedUuid],
    queryFn: () => payments.getPaymentAttempt(selectedUuid!),
    enabled: selectedUuid !== null,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el historial de pagos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de pagos</h1>
        <p className="text-sm text-gray-500 mt-1">Consultá el estado de tus pagos</p>
      </div>

      {!data?.length ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500">No tenés pagos registrados.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Monto</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Proveedor</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((attempt) => (
                <tr
                  key={attempt.uuid}
                  onClick={() => setSelectedUuid(attempt.uuid)}
                  className={`hover:bg-gray-50 cursor-pointer ${selectedUuid === attempt.uuid ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-4 py-3 text-gray-700">{attempt.attempted_at ? new Date(attempt.attempted_at).toLocaleDateString('es-UY') : '—'}</td>
                  <td className="px-4 py-3"><PaymentAmount amountCents={attempt.amount_total} currency={attempt.currency} /></td>
                  <td className="px-4 py-3"><PaymentStatusBadge status={attempt.status} /></td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{attempt.provider.replace('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUuid && (
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Detalle del pago</h2>
            <button
              type="button"
              onClick={() => setSelectedUuid(null)}
              className="p-1 rounded text-gray-400 hover:text-gray-600"
              aria-label="Cerrar detalle"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {detail.isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
            </div>
          )}
          {detail.error && (
            <p className="text-sm text-red-600">No pudimos cargar el detalle de este pago.</p>
          )}
          {detail.data && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Estado</dt>
                <dd><PaymentStatusBadge status={detail.data.status} /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Monto</dt>
                <dd className="font-medium text-gray-900">
                  <PaymentAmount amountCents={detail.data.amount_total} currency={detail.data.currency} />
                </dd>
              </div>
              {detail.data.payment_method && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tarjeta</dt>
                  <dd className="text-gray-900">{detail.data.payment_method.display_number}</dd>
                </div>
              )}
              {detail.data.completed_at && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Completado</dt>
                  <dd className="text-gray-900">{new Date(detail.data.completed_at).toLocaleString('es-UY')}</dd>
                </div>
              )}
              {detail.data.error_code && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Error</dt>
                  <dd className="text-gray-900">{detail.data.error_code}{detail.data.error_message ? ` — ${detail.data.error_message}` : ''}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
