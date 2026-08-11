import { useQuery } from '@tanstack/react-query';
import { PaymentStatusBadge, PaymentAmount } from '@goool/sdk';
import type { PaymentAttemptDTO } from '@goool/sdk';
import { useSociosApi } from '@/providers/SociosProvider';

export function PaymentHistoryPage() {
  const { client } = useSociosApi();

  const { data, isLoading } = useQuery({
    queryKey: ['payment-attempts'],
    queryFn: async () => {
      const res = await client.get<{ data: PaymentAttemptDTO[] }>('/socios/v1/payment-attempts');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
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
                <tr key={attempt.uuid} className="hover:bg-gray-50">
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
    </div>
  );
}
