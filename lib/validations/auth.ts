import { z } from "zod";

export const createLoginSchema = () =>
  z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

export const createRegisterUserSchema = () =>
  z
    .object({
      email: z.string().email("Invalid email"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      lastname: z.string().min(2, "Lastname must be at least 2 characters"),
      confirmPassword: z.string(),
      role: z.literal("user"),

      // Location and contact fields for users
      phone: z.string().min(8, "Phone number is required"),
      country_id: z.string().uuid("Invalid country selection"),
      depto_state_id: z.string().uuid("Invalid department selection"),
      city_municipality_id: z.string().uuid("Invalid municipality selection"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

export const createRegisterLawyerSchema = () =>
  z
    .object({
      email: z.string().email("Invalid email"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
      name: z.string().min(2, "Name must be at least 2 characters"),
      lastname: z.string().min(2, "Lastname must be at least 2 characters"),
      confirmPassword: z.string(),
      role: z.literal("lawyer"),

      // Lawyer-specific fields
      lawyer_credential_number: z.string().optional(),
      national_id: z.string().min(1, "National ID is required for lawyers"),
      phone: z.string().min(8, "Phone number is required"),

      // Location fields
      country_id: z.string().uuid("Invalid country selection"),
      depto_state_id: z.string().uuid("Invalid department selection"),
      city_municipality_id: z.string().uuid("Invalid municipality selection"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

// Keep the old schema name for backwards compatibility
export const createRegisterSchema = createRegisterUserSchema;

export const createResetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

export const createVerifyOtpSchema = () =>
  z.object({
    code: z.string().length(8, "Code must be 8 characters"),
  });

export const createVerifyEmailSchema = () =>
  z.object({
    email: z.string().email("Invalid email"),
  });

export type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterUserFormData = z.infer<ReturnType<typeof createRegisterUserSchema>>;
export type RegisterLawyerFormData = z.infer<ReturnType<typeof createRegisterLawyerSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>; // Keep for backwards compatibility
export type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordSchema>>;
export type VerifyOtpFormData = z.infer<ReturnType<typeof createVerifyOtpSchema>>;
export type VerifyEmailFormData = z.infer<ReturnType<typeof createVerifyEmailSchema>>;
