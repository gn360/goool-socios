import { useFamily, useToggleMember, type FamilyMember } from '@/shared/hooks/useFamily';
import { useAuth } from '@goool/sdk';

export function FamilyPage() {
  const { user } = useAuth();
  const { data: members, isLoading, error } = useFamily();
  const toggleMember = useToggleMember();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el grupo familiar.</p>
      </div>
    );
  }

  const leader = members?.find((m) => m.is_leader);
  const dependents = members?.filter((m) => !m.is_leader) ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi familia</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestioná los accesos de los miembros de tu grupo familiar.
        </p>
      </div>

      {/* Leader card */}
      {leader && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}>
              Titular
            </span>
          </div>
          <MemberInfo member={leader} />
        </div>
      )}

      {/* Dependents */}
      {dependents.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Dependientes ({dependents.length})
          </h2>
          {dependents.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              isToggling={toggleMember.isPending}
              onToggle={(action) => toggleMember.mutate({ id: member.id, action })}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500">No hay miembros dependientes en tu grupo familiar.</p>
          <p className="text-xs text-gray-400 mt-1">
            Los nuevos miembros se agregan mediante invitación desde el panel del club.
          </p>
        </div>
      )}

      {/* Toggle feedback */}
      {toggleMember.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {(toggleMember.error as Error)?.message ?? 'Error al cambiar el estado del miembro.'}
        </div>
      )}
    </div>
  );
}

function MemberCard({
  member,
  isToggling,
  onToggle,
}: {
  member: FamilyMember;
  isToggling: boolean;
  onToggle: (action: 'activate' | 'deactivate') => void;
}) {
  const isActive = member.status === 'active';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
      <MemberInfo member={member} />
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isActive}
          disabled={isToggling}
          onChange={() => {
            if (isActive && !confirm('¿Desactivar a este miembro? No podrá iniciar sesión hasta que lo reactives.')) {
              return;
            }
            onToggle(isActive ? 'deactivate' : 'activate');
          }}
        />
        <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" style={{ backgroundColor: isActive ? 'var(--color-primary)' : undefined }} />
      </label>
    </div>
  );
}

function MemberInfo({ member }: { member: FamilyMember }) {
  const fullName = [member.name, member.last_name].filter(Boolean).join(' ') || 'Sin nombre';
  const age = member.birth_date
    ? Math.floor((Date.now() - new Date(member.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  return (
    <div>
      <p className="text-sm font-medium text-gray-900">{fullName}</p>
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
        {member.email && <span>{member.email}</span>}
        {age !== null && (
          <>
            <span>·</span>
            <span>{age} años</span>
          </>
        )}
      </div>
    </div>
  );
}
