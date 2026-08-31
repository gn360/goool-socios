import { useForm } from 'react-hook-form';
import type { SociosProfileDTO, SociosProfileUpdateInput } from '@goool/sdk';
import { Button, InputField } from '@goool/sdk';
import { User, Phone } from 'lucide-react';
import { profileSchema, type ProfileFormData } from './schemas';

interface ProfileFormProps {
  profile: SociosProfileDTO;
  isSubmitting: boolean;
  onSubmit: (input: SociosProfileUpdateInput) => Promise<void>;
}

/**
 * Editable basic account data of the member's own profile.
 *
 * Empty optional fields are transformed to null (clears the value on the
 * backend). Document and birth date are NOT editable here.
 */
export function ProfileForm({ profile, isSubmitting, onSubmit }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile.user.name ?? '',
      last_name: profile.user.last_name ?? '',
      phone: profile.user.phone ?? '',
    },
  });

  const onFormSubmit = (data: ProfileFormData) => {
    const result = profileSchema.safeParse(data);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ProfileFormData;

        setError(path, { type: 'manual', message: issue.message });
      }
      return;
    }

    const input: SociosProfileUpdateInput = {
      name: result.data.name,
      last_name: result.data.last_name ? result.data.last_name : null,
      phone: result.data.phone ? result.data.phone : null,
    };

    void onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nombre"
          {...register('name')}
          error={errors.name?.message}
          icon={User}
          placeholder="Tu nombre"
          disabled={isSubmitting}
        />

        <InputField
          label="Apellido"
          {...register('last_name')}
          error={errors.last_name?.message}
          icon={User}
          placeholder="Tu apellido"
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

      <div className="flex items-center justify-end">
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
