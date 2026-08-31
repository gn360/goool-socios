import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PaymentMethodCard, Button, InputField, type CreatePaymentMethodInput } from '@goool/sdk';
import { useSociosApi } from '@/providers/SociosProvider';
import { cardSchema, type CardFormData } from './schemas';

export function PaymentMethodsPage() {
  const { payments } = useSociosApi();
  const { data: methods, isLoading, error, refetch } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => payments.listPaymentMethods(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => payments.deletePaymentMethod(id),
    onSuccess: () => refetch(),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: number) => payments.setDefaultPaymentMethod(id),
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 text-sm">Error al cargar los métodos de pago.</p>
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

      {showAddForm && <AddCardForm onSuccess={() => { setShowAddForm(false); refetch(); }} />}

      {removeMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          No se pudo eliminar la tarjeta.
        </div>
      )}
      {setDefaultMutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          No se pudo cambiar la tarjeta principal.
        </div>
      )}

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

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const { payments } = useSociosApi();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
  } = useForm<CardFormData>({
    defaultValues: {
      card_holder: '',
      card_number: '',
      expiration_month: '',
      expiration_year: '',
      cvv: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: (input: CreatePaymentMethodInput) => payments.createPaymentMethod(input),
    onSuccess: () => {
      setError('');
      onSuccess();
    },
    onError: (err: unknown) => {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'No se pudo guardar la tarjeta. Verificá los datos e intentá nuevamente.',
      );
    },
  });

  const onFormSubmit = (data: CardFormData) => {
    const result = cardSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof CardFormData;

        setFieldError(path, { type: 'manual', message: issue.message });
      }
      return;
    }

    submitMutation.mutate(result.data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 bg-white border rounded-xl p-5" noValidate>
      <InputField
        label="Titular de la tarjeta"
        {...register('card_holder')}
        error={errors.card_holder?.message}
        placeholder="Nombre como figura en la tarjeta"
        disabled={submitMutation.isPending}
      />

      <InputField
        label="Número de tarjeta"
        {...register('card_number')}
        error={errors.card_number?.message}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        disabled={submitMutation.isPending}
      />

      <div className="grid grid-cols-3 gap-3">
        <InputField
          label="Mes"
          {...register('expiration_month')}
          error={errors.expiration_month?.message}
          placeholder="MM"
          maxLength={2}
          disabled={submitMutation.isPending}
        />
        <InputField
          label="Año"
          {...register('expiration_year')}
          error={errors.expiration_year?.message}
          placeholder="YYYY"
          maxLength={4}
          disabled={submitMutation.isPending}
        />
        <InputField
          label="CVV"
          {...register('cvv')}
          error={errors.cvv?.message}
          placeholder="123"
          maxLength={4}
          disabled={submitMutation.isPending}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" loading={submitMutation.isPending}>
        Guardar tarjeta
      </Button>
    </form>
  );
}
