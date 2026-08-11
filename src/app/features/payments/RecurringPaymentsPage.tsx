import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { RecurringPaymentDTO, PaymentMethodDTO } from '@goool/sdk';
import { useSociosApi } from '@/providers/SociosProvider';

export function RecurringPaymentsPage() {
  const { client } = useSociosApi();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recurring-payments'],
    queryFn: async () => {
      const res = await client.get<{ data: RecurringPaymentDTO[] }>('/socios/v1/recurring-payments');
      return res.data.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => client.delete(`/socios/v1/recurring-payments/${id}`),
    onSuccess: () => refetch(),
  });

  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagos automáticos</h1>
          <p className="text-sm text-gray-500 mt-1">Configurá la renovación automática de tus membresías</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 text-sm font-medium rounded-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>{showForm ? 'Cancelar' : '+ Configurar'}</button>
      </div>
      {showForm && <CreateRecurringForm client={client} onSuccess={() => { setShowForm(false); refetch(); }} />}
      {!data?.length ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500">No tenés pagos automáticos configurados.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((rp) => (
            <div key={rp.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{rp.frequency}</p>
                <p className="text-xs text-gray-500 mt-0.5">Próximo: {rp.next_due_at ? new Date(rp.next_due_at).toLocaleDateString('es-UY') : '—'}</p>
                {rp.payment_method && <p className="text-xs text-gray-400">{rp.payment_method.display_number}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {rp.status === 'active' ? 'Activo' : rp.status}
                </span>
                {rp.status === 'active' && <button onClick={() => cancelMutation.mutate(rp.id)} className="text-xs text-red-500 hover:underline">Cancelar</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateRecurringForm({ client, onSuccess }: { client: any; onSuccess: () => void }) {
  const { data: methods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => { const res = await client.get<{ data: PaymentMethodDTO[] }>('/socios/v1/payment-methods'); return res.data.data; },
  });
  const [form, setForm] = useState({ payment_method_id: '', membership_id: '', frequency: 'monthly' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { await client.post('/socios/v1/recurring-payments', form); onSuccess(); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tarjeta</label>
        <select value={form.payment_method_id} onChange={(e) => setForm({ ...form, payment_method_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required>
          <option value="">Seleccionar tarjeta</option>
          {methods?.map((m) => (<option key={m.id} value={m.id}>{m.display_number} {m.is_default ? '(default)' : ''}</option>))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ID de membresía</label>
        <input type="number" value={form.membership_id} onChange={(e) => setForm({ ...form, membership_id: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia</label>
        <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <option value="monthly">Mensual</option><option value="quarterly">Trimestral</option><option value="semester">Semestral</option><option value="yearly">Anual</option>
        </select>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)' }}>{submitting ? 'Configurando...' : 'Activar pago automático'}</button>
    </form>
  );
}
