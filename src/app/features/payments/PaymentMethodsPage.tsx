import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPaymentMethods, PaymentMethodCard } from '@goool/sdk';
import { useSociosApi } from '@/providers/SociosProvider';

export function PaymentMethodsPage() {
  const { client } = useSociosApi();
  const { data: methods, isLoading, refetch } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => client.delete(`/socios/v1/payment-methods/${id}`),
    onSuccess: () => refetch(),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => client.patch(`/socios/v1/payment-methods/${id}/default`),
    onSuccess: () => refetch(),
  });

  const [showAddForm, setShowAddForm] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900">Métodos de pago</h1>
          <p className="text-sm text-gray-500 mt-1">Gestioná tus tarjetas guardadas</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {showAddForm ? 'Cancelar' : '+ Agregar tarjeta'}
        </button>
      </div>

      {showAddForm && <AddCardForm client={client} onSuccess={() => { setShowAddForm(false); refetch(); }} />}

      {!methods?.length ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <p className="text-gray-500">No tenés tarjetas guardadas.</p>
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} className="mt-3 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
              Agregar mi primera tarjeta
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <PaymentMethodCard
              key={m.id}
              method={m}
              onSetDefault={m.is_default ? undefined : (id) => setDefaultMutation.mutate(id)}
              onRemove={(id) => removeMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddCardForm({ client, onSuccess }: { client: any; onSuccess: () => void }) {
  const [form, setForm] = useState({ card_number: '', card_holder: '', expiration_month: '', expiration_year: '', cvv: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post('/socios/v1/payment-methods', form);
      onSuccess();
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titular de la tarjeta</label>
        <input type="text" value={form.card_holder} onChange={(e) => setForm({ ...form, card_holder: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
        <input type="text" value={form.card_number} onChange={(e) => setForm({ ...form, card_number: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" maxLength={19} required />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mes</label><input type="text" placeholder="MM" value={form.expiration_month} onChange={(e) => setForm({ ...form, expiration_month: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" maxLength={2} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Año</label><input type="text" placeholder="YYYY" value={form.expiration_year} onChange={(e) => setForm({ ...form, expiration_year: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" maxLength={4} required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">CVV</label><input type="text" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" maxLength={4} required /></div>
      </div>
      <button type="submit" disabled={submitting} className="w-full py-2 text-sm font-medium rounded-lg text-white disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)' }}>{submitting ? 'Tokenizando...' : 'Guardar tarjeta'}</button>
    </form>
  );
}
