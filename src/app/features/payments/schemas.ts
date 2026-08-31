import { z } from 'zod';

/**
 * Card tokenization form. Mirrors the backend rules of
 * TokenizeCardRequest (card_number 13-19, holder, expiration, cvv).
 */
export const cardSchema = z.object({
  card_holder: z
    .string()
    .trim()
    .min(1, 'El titular es obligatorio.')
    .max(255, 'El titular no puede superar los 255 caracteres.'),
  card_number: z
    .string()
    .trim()
    .regex(/^\d{13,19}$/, 'El número debe tener entre 13 y 19 dígitos.'),
  expiration_month: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])$/, 'Mes inválido (01-12).'),
  expiration_year: z
    .string()
    .trim()
    .regex(/^\d{2,4}$/, 'Año inválido.'),
  cvv: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'CVV inválido (3-4 dígitos).'),
});

export type CardFormData = z.infer<typeof cardSchema>;
