import { useState } from 'react';
import {
  Button,
  useSociosNotifications,
  type SociosNotificationDTO,
  type SociosNotificationFilterStatus,
  type SociosNotificationFilterType,
} from '@goool/sdk';
import {
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { useSociosApi } from '@/providers/SociosProvider';

const TYPE_LABELS: Record<string, string> = {
  payment: 'Notificación de pago',
  recurring: 'Notificación de suscripción',
  membership: 'Notificación de membresía',
  invoice: 'Notificación de factura',
};

const STATUS_LABELS: Record<SociosNotificationFilterStatus, string> = {
  sent: 'Enviada',
  queued: 'Pendiente',
  failed: 'Fallida',
};

const STATUS_STYLES: Record<SociosNotificationFilterStatus, string> = {
  sent: 'bg-green-50 text-green-700 border-green-200',
  queued: 'bg-gray-50 text-gray-600 border-gray-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function subjectFor(notification: SociosNotificationDTO): string {
  if (notification.subject) {
    return notification.subject;
  }

  const prefix = notification.type.split('.')[0] ?? '';
  return TYPE_LABELS[prefix] ?? notification.type;
}

export function NotificationsPage() {
  const { client } = useSociosApi();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<SociosNotificationFilterType | ''>('');
  const [status, setStatus] = useState<SociosNotificationFilterStatus | ''>('');

  const filters = {
    ...(type !== '' ? { type } : {}),
    ...(status !== '' ? { status } : {}),
  };

  const { data, isLoading, isError, isPlaceholderData } = useSociosNotifications(
    client,
    'socios',
    page,
    filters,
  );

  const handleTypeChange = (value: SociosNotificationFilterType | '') => {
    setType(value);
    setPage(1);
  };

  const handleStatusChange = (value: SociosNotificationFilterStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const meta = data?.meta;
  const notifications = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        <p className="text-sm text-gray-500 mt-1">El historial de avisos que te enviamos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as SociosNotificationFilterType | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          aria-label="Filtrar por tipo"
        >
          <option value="">Todas</option>
          <option value="payment">Pagos</option>
          <option value="recurring">Suscripción</option>
          <option value="membership">Membresía</option>
          <option value="invoice">Facturas</option>
        </select>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value as SociosNotificationFilterStatus | '')}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          aria-label="Filtrar por estado"
        >
          <option value="">Todas</option>
          <option value="sent">Enviadas</option>
          <option value="failed">Fallidas</option>
          <option value="queued">Pendientes</option>
        </select>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }} />
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p className="text-red-700 text-sm">Error al cargar tus notificaciones.</p>
        </div>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tenés notificaciones todavía.</p>
        </div>
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <>
          <div className="bg-white border rounded-xl overflow-hidden">
            <ul className="divide-y">
              {notifications.map((notification) => {
                const channelIcon =
                  notification.channel === 'email' ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  );

                const channelLabel = notification.channel === 'email' ? 'Mail' : 'WhatsApp';

                return (
                  <li key={notification.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-2 rounded-lg bg-gray-100 text-gray-500 shrink-0">
                        {channelIcon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-sm font-medium text-gray-900">{subjectFor(notification)}</p>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[notification.status]}`}
                          >
                            {STATUS_LABELS[notification.status]}
                          </span>
                        </div>

                        {notification.body && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{notification.body}</p>
                        )}

                        <p className="mt-1 text-xs text-gray-400">
                          {channelLabel}
                          {' · '}
                          {notification.sent_at
                            ? formatDate(notification.sent_at)
                            : notification.created_at
                              ? formatDate(notification.created_at)
                              : '—'}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary-outline"
                size="sm"
                disabled={page <= 1 || isPlaceholderData}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>

              <span className="text-sm text-gray-500">
                Página {meta.current_page} de {meta.last_page}
              </span>

              <Button
                variant="secondary-outline"
                size="sm"
                disabled={page >= meta.last_page || isPlaceholderData}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
