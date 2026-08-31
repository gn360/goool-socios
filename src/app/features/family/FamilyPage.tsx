import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useSociosFamily,
  useToggleFamilyMember,
  useUpdateFamilyMember,
  useSociosFamilyInvitations,
  useInviteFamilyMember,
  useCancelFamilyInvitation,
  Button,
  InputField,
  type FamilyMember,
  type UpdateFamilyMemberInput,
} from '@goool/sdk';
import { User, Phone, Mail, Pencil, X, Send } from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';
import { inviteFamilyMemberSchema, memberEditSchema, type InviteFamilyMemberFormData, type MemberEditFormData } from './schemas';

export function FamilyPage() {
  const { client } = useSociosApi();
  const family = useSociosFamily(client, 'socios');
  const toggleMember = useToggleFamilyMember(client, 'socios');
  const updateMember = useUpdateFamilyMember(client, 'socios');
  const invitations = useSociosFamilyInvitations(client, 'socios');
  const invite = useInviteFamilyMember(client, 'socios');
  const cancelInvitation = useCancelFamilyInvitation(client, 'socios');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editError, setEditError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  if (family.isLoading || invitations.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (family.error || invitations.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar el grupo.</p>
      </div>
    );
  }

  const members = family.data ?? [];
  const leader = members.find((m) => m.is_leader);
  const dependents = members.filter((m) => !m.is_leader);
  const pendingInvitations = (invitations.data ?? []).filter((i) => i.status === 'pending');

  const handleSaveMember = async (id: number, input: UpdateFamilyMemberInput) => {
    setEditError('');

    try {
      await updateMember.mutateAsync({ id, input });
      setEditingId(null);
    } catch (err: unknown) {
      setEditError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'No se pudieron guardar los cambios. Intentá nuevamente.',
      );
    }
  };

  const handleInvite = async (data: InviteFamilyMemberFormData) => {
    setInviteSuccess('');

    await invite.mutateAsync({ email: data.email });

    setInviteSuccess(`Invitación enviada a ${data.email}.`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi grupo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestioná los accesos de los miembros de tu grupo.
        </p>
      </div>

      {/* Leader card */}
      {leader && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }}>
              Líder del grupo
            </span>
          </div>
          <MemberInfo member={leader} />
        </div>
      )}

      {/* Dependents */}
      {dependents.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Miembros ({dependents.length})
          </h2>
          {dependents.map((member) =>
            editingId === member.id ? (
              <MemberEditForm
                key={member.id}
                member={member}
                isSubmitting={updateMember.isPending}
                onSubmit={(input) => handleSaveMember(member.id, input)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <MemberCard
                key={member.id}
                member={member}
                isToggling={toggleMember.isPending}
                onEdit={() => {
                  setEditError('');
                  setEditingId(member.id);
                }}
                onToggle={(action) => toggleMember.mutate({ id: member.id, action })}
              />
            ),
          )}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-sm text-gray-500">No hay miembros en tu grupo.</p>
          <p className="text-xs text-gray-400 mt-1">
            Invitá nuevos miembros desde la sección de invitaciones.
          </p>
        </div>
      )}

      {/* Feedback */}
      {editError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {editError}
        </div>
      )}
      {toggleMember.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {(toggleMember.error as Error)?.message ?? 'Error al cambiar el estado del miembro.'}
        </div>
      )}

      {/* Invitations */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Invitar miembros
        </h2>
        <p className="text-xs text-gray-500">
          Enviá una invitación por email. La persona podrá aceptarla e incorporarse a tu grupo.
        </p>

        <InviteForm isSubmitting={invite.isPending} onSubmit={handleInvite} />

        {inviteSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
            {inviteSuccess}
          </div>
        )}
        {invite.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {(invite.error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
              'No se pudo enviar la invitación.'}
          </div>
        )}

        {pendingInvitations.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Invitaciones pendientes ({pendingInvitations.length})
            </h3>
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{invitation.email}</p>
                  <p className="text-xs text-gray-500">
                    Vence el {formatInvitationDate(invitation.expires_at)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary-outline"
                  size="sm"
                  loading={cancelInvitation.isPending}
                  onClick={() => {
                    if (confirm('¿Cancelar la invitación a este email?')) {
                      cancelInvitation.mutate(invitation.id);
                    }
                  }}
                >
                  Cancelar
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            No hay invitaciones pendientes.
          </p>
        )}

        {cancelInvitation.isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            No se pudo cancelar la invitación.
          </div>
        )}
      </section>
    </div>
  );
}

function InviteForm({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: (data: InviteFamilyMemberFormData) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<InviteFamilyMemberFormData>({ defaultValues: { email: '' } });

  const onFormSubmit = async (data: InviteFamilyMemberFormData) => {
    const result = inviteFamilyMemberSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof InviteFamilyMemberFormData;

        setError(path, { type: 'manual', message: issue.message });
      }
      return;
    }

    try {
      await onSubmit(result.data);
      reset();
    } catch {
      // The error surface is rendered by the parent via mutation state.
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex items-start gap-3" noValidate>
      <div className="flex-1">
        <InputField
          label="Email del invitado"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          icon={Mail}
          placeholder="invitado@example.com"
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" variant="primary" loading={isSubmitting} className="mt-6">
        <Send className="w-4 h-4" />
        Invitar
      </Button>
    </form>
  );
}

function MemberEditForm({
  member,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  member: FamilyMember;
  isSubmitting: boolean;
  onSubmit: (input: UpdateFamilyMemberInput) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MemberEditFormData>({
    defaultValues: {
      name: member.name ?? '',
      last_name: member.last_name ?? '',
      phone: '',
    },
  });

  const onFormSubmit = (data: MemberEditFormData) => {
    const result = memberEditSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof MemberEditFormData;

        setError(path, { type: 'manual', message: issue.message });
      }
      return;
    }

    void onSubmit({
      name: result.data.name,
      last_name: result.data.last_name ? result.data.last_name : null,
      phone: result.data.phone ? result.data.phone : null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
      noValidate
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">Editar datos</p>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 rounded text-gray-400 hover:text-gray-600"
          aria-label="Cancelar edición"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputField
          label="Nombre"
          {...register('name')}
          error={errors.name?.message}
          icon={User}
          disabled={isSubmitting}
        />
        <InputField
          label="Apellido"
          {...register('last_name')}
          error={errors.last_name?.message}
          icon={User}
          disabled={isSubmitting}
        />
      </div>

      <InputField
        label="Teléfono"
        {...register('phone')}
        error={errors.phone?.message}
        icon={Phone}
        placeholder="099123456"
        disabled={isSubmitting}
      />

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary-outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}

function MemberCard({
  member,
  isToggling,
  onEdit,
  onToggle,
}: {
  member: FamilyMember;
  isToggling: boolean;
  onEdit: () => void;
  onToggle: (action: 'activate' | 'deactivate') => void;
}) {
  const isActive = member.status === 'active';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
      <MemberInfo member={member} />
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          aria-label={`Editar a ${member.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
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
          <div
            className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
            style={{ backgroundColor: isActive ? 'var(--color-primary)' : undefined }}
          />
        </label>
      </div>
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
      {(member.status === 'inactive' || member.age_restricted) && (
        <div className="flex items-center gap-2 mt-1">
          {member.status === 'inactive' && (
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              Inactivo
            </span>
          )}
          {member.age_restricted && (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Acceso restringido por edad
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function formatInvitationDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const [year, month, day] = (value.split('T')[0] ?? '').split('-');

  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
