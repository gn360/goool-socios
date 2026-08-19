import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MembershipCard, PaymentAmount } from '@goool/sdk';
import type { MembershipOverviewDTO } from '@goool/sdk';
import { Link } from 'react-router-dom';
import { CreditCard, Receipt, FileText, Repeat } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

export function MembershipPage() {
  const { client } = useSociosApi();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['membership-overview'],
    queryFn: async () => {
      const res = await client.get<{ data: MembershipOverviewDTO }>('/socios/v1/membership');
      return res.data.data;
    },
  });

  const resumeMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      await client.post(`/socios/v1/recurring-payments/${subscriptionId}/resume`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['membership-overview'] });
    },
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
        <p className="text-red-700 text-sm">Error al cargar tu membresía.</p>
      </div>
    );
  }

  const membership = data?.membership ?? null;

  if (!membership) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi membresía</h1>
          <p className="text-sm text-gray-500 mt-1">Tu plan y suscripción</p>
        </div>

        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Todavía no tenés una membresía.</p>
          <p className="text-xs text-gray-400 mt-1">Cuando el club te asigne un plan, lo vas a ver acá.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi membresía</h1>
        <p className="text-sm text-gray-500 mt-1">Tu plan y suscripción</p>
      </div>

      {membership.payment_status === 'late' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-800 text-sm">
            Tenés pagos pendientes. Regularizá tu situación desde tus métodos de pago.
          </p>
        </div>
      )}

      <MembershipCard
        membership={membership}
        onResume={
          membership.subscription?.status === 'paused'
            ? () => resumeMutation.mutate(membership.subscription!.id)
            : undefined
        }
        resuming={resumeMutation.isPending}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/recurring-payments" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)] transition-all flex items-center gap-4">
          <Repeat className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 className="font-semibold text-gray-900">Cobros automáticos</h3>
            <p className="text-sm text-gray-500 mt-0.5">Configurá o cancelá tu suscripción</p>
          </div>
        </Link>
        <Link to="/payment-methods" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)] transition-all flex items-center gap-4">
          <CreditCard className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 className="font-semibold text-gray-900">Métodos de pago</h3>
            <p className="text-sm text-gray-500 mt-0.5">Administrá tus tarjetas guardadas</p>
          </div>
        </Link>
        <Link to="/payments" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)] transition-all flex items-center gap-4">
          <Receipt className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 className="font-semibold text-gray-900">Historial de pagos</h3>
            <p className="text-sm text-gray-500 mt-0.5">Todos tus pagos</p>
          </div>
        </Link>
        <Link to="/invoices" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[var(--color-primary)] transition-all flex items-center gap-4">
          <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 className="font-semibold text-gray-900">Facturas</h3>
            <p className="text-sm text-gray-500 mt-0.5">Tus facturas mensuales</p>
          </div>
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm font-medium text-gray-500">Últimos pagos</h2>
        </div>
        {!data?.payment_history.last_payments.length ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            No hay pagos registrados todavía.
          </div>
        ) : (
          <ul className="divide-y">
            {data.payment_history.last_payments.map((payment) => (
              <li key={payment.id} className="px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-gray-500 text-xs">
                  {new Date(payment.created_at).toLocaleDateString('es-UY')}
                </span>
                <span className="font-medium text-gray-900">
                  <PaymentAmount amountCents={payment.amount_total} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
