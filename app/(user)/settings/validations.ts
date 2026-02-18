import { z } from "zod";

export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  country: z.string().min(1, "Selecciona un país"),
  department: z.string().min(1, "Selecciona un departamento"),
});

export const professionalProfileSchema = z.object({
  collegiateNumber: z.string(),
  nationalId: z.string(),
  visibleInDirectory: z.boolean(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema>;
