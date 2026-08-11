import { useQuery } from '@tanstack/react-query';
import { PaymentAmount } from '@goool/sdk';
import type { InvoiceDTO } from '@goool/sdk';
import { useSociosApi } from '@/providers/SociosProvider';

export function InvoiceListPage() {
  const { client } = useSociosApi();

  const { data, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await client.get<{ data: InvoiceDTO[] }>('/socios/v1/invoices');
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
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <p className="text-sm text-gray-500 mt-1">Consultá tus facturas mensuales</p>
      </div>
      {!data?.length ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500">No tenés facturas disponibles.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((inv) => (
            <div key={inv.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{inv.charge_month}</p>
                <p className="text-xs text-gray-500 mt-0.5">Factura mensual</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900"><PaymentAmount amountCents={inv.amount_net} /></p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Total: <PaymentAmount amountCents={inv.amount_total} />
                  {inv.amount_fee > 0 && <> · Recargo: <PaymentAmount amountCents={inv.amount_fee} /></>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
