import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PaymentAmount, Button } from '@goool/sdk';
import { Download, X } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

export function InvoiceListPage() {
  const { client, payments } = useSociosApi();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadError, setDownloadError] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => payments.listInvoices(),
  });

  const detail = useQuery({
    queryKey: ['invoice-detail', selectedId],
    queryFn: () => payments.getInvoice(selectedId!),
    enabled: selectedId !== null,
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
        <p className="text-red-700 text-sm">Error al cargar las facturas.</p>
      </div>
    );
  }

  const handleDownload = async (id: number) => {
    setDownloadError('');
    setDownloadingId(id);

    try {
      const response = await client.get(`/socios/v1/invoices/${id}/download`, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(response.data);
      window.open(url, '_blank');
    } catch {
      setDownloadError('No se pudo descargar la factura.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <p className="text-sm text-gray-500 mt-1">Consultá tus facturas mensuales</p>
      </div>

      {downloadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {downloadError}
        </div>
      )}

      {!data?.length ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500">No tenés facturas disponibles.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((inv) => (
            <div
              key={inv.id}
              className={`bg-white border rounded-xl p-4 flex items-center justify-between cursor-pointer ${selectedId === inv.id ? 'border-[var(--color-primary)]' : ''}`}
              onClick={() => setSelectedId(inv.id)}
            >
              <div>
                <p className="font-medium text-gray-900">{inv.charge_month}</p>
                <p className="text-xs text-gray-500 mt-0.5">Factura mensual</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900"><PaymentAmount amountCents={inv.amount_net} /></p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Total: <PaymentAmount amountCents={inv.amount_total} />
                    {inv.amount_fee > 0 && <> · Recargo: <PaymentAmount amountCents={inv.amount_fee} /></>}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary-outline"
                  size="sm"
                  loading={downloadingId === inv.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDownload(inv.id);
                  }}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId !== null && (
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Detalle de la factura</h2>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
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
          {detail.error && <p className="text-sm text-red-600">No pudimos cargar el detalle de esta factura.</p>}
          {detail.data && (
            <div className="space-y-3 text-sm">
              {(detail.data.lines ?? []).length > 0 ? (
                <ul className="divide-y">
                  {detail.data.lines!.map((line, index) => (
                    <li key={index} className="py-2 flex items-center justify-between">
                      <span className="text-gray-700">{line.description}</span>
                      <span className="font-medium text-gray-900"><PaymentAmount amountCents={line.amount} /></span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Cuota de membresía</p>
              )}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span className="text-gray-700">Total</span>
                <span className="text-gray-900"><PaymentAmount amountCents={detail.data.amount_total} /></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
