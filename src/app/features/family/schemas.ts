import { z } from 'zod';

/**
 * Invite a family member by email. Mirrors the backend rules of
 * StoreFamilyInvitationRequest.
 */
export const inviteFamilyMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio.')
    .email('El email debe ser válido.')
    .max(255, 'El email no puede superar los 255 caracteres.'),
});

export type InviteFamilyMemberFormData = z.infer<typeof inviteFamilyMemberSchema>;

/**
 * Editable basic data of a family group dependent. Mirrors the backend
 * rules of UpdateFamilyMemberRequest (name/last_name/phone only).
 */
export const memberEditSchema = z.object({
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

export type MemberEditFormData = z.infer<typeof memberEditSchema>;
