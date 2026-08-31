import { z } from 'zod';

/**
 * Editable profile fields of the member's own account.
 * Mirrors the backend rules of UpdateSociosProfileRequest
 * (name max 100, last_name max 100, phone max 30).
 */
export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  last_name: z
    .string()
    .trim()
    .max(100, 'El apellido no puede superar los 100 caracteres.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(30, 'El teléfono no puede superar los 30 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Password change form. Mirrors the backend rules of ChangePasswordRequest
 * (min 8, confirmation match, different from current).
 */
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'La contraseña actual es obligatoria.'),
    password: z
      .string()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.')
      .max(100, 'La nueva contraseña no puede superar los 100 caracteres.'),
    password_confirmation: z.string().min(1, 'Confirmá la nueva contraseña.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden.',
    path: ['password_confirmation'],
  })
  .refine((data) => data.password !== data.current_password, {
    message: 'La nueva contraseña debe ser distinta a la actual.',
    path: ['password'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
