import { Link } from 'react-router-dom';
import { useMembershipCard, MembershipVirtualCard } from '@goool/sdk';
import { CreditCard } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

/**
 * Virtual membership card page (/card). Renders the SDK card component
 * with the member's own card payload.
 */
export function CardPage() {
  const { client } = useSociosApi();
  const { data, isLoading, error } = useMembershipCard(client, 'socios');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  const status = (error as { response?: { status?: number } } | null)?.response?.status;

  if (status === 404) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Todavía no tenés una membresía.</p>
          <p className="text-xs text-gray-400 mt-1">
            Cuando el club te asigne un plan, vas a poder ver tu carnet acá.
          </p>
          <Link
            to="/memberships"
            className="inline-block mt-4 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            Ver mi membresía
          </Link>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar tu carnet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Mi carnet</h1>
        <p className="text-sm text-gray-500 mt-1">Tu carnet virtual de socio</p>
      </div>

      <MembershipVirtualCard card={data} />

      <p className="text-center text-xs text-gray-400">
        Presentá este carnet en la sede de tu club.
      </p>
    </div>
  );
}
