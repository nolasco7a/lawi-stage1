import { z } from "zod"
import type { TranslateFunction } from "../types/common";

export const createAccountSchema = (t: TranslateFunction) => z.object({
    name: z.string().min(1, t("validation.name.min")),
    lastname: z.string().min(1, t("validation.lastname.min")),
})

export type AccountFormData = z.infer<ReturnType<typeof createAccountSchema>>;

export const createContactSchema = (t: TranslateFunction) => z.object({
    email: z.string().email(t("validation.email.invalid")),
    phone: z.string().min(1, t("validation.phone.min")),
})

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export const createPasswordSchema = (t: TranslateFunction) => z.object({
    password: z.string()
    .min(8, t('validation.password.min'))
    .regex(/[A-Z]/, t('validation.password.uppercase'))
    .regex(/[a-z]/, t('validation.password.lowercase'))
    .regex(/[0-9]/, t('validation.password.number'))
    .regex(/[^A-Za-z0-9]/, t('validation.password.special')),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('validation.password.match'),
  path: ['confirmPassword'],
});

export type PasswordFormData = z.infer<ReturnType<typeof createPasswordSchema>>;