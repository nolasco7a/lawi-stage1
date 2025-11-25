"use server";

import { z } from "zod";

import {
  createPasswordResetToken,
  createUser,
  createUserWithDetails,
  deletePasswordResetToken,
  getPasswordResetToken,
  getUser,
  incrementPasswordResetAttempts,
  updateUserPassword,
} from "@/lib/db/queries";
import emailProvider from "@/lib/email/provider";
import {
  createRegisterLawyerSchema,
  createRegisterUserSchema,
  createResetPasswordSchema,
  createVerifyEmailSchema,
  createVerifyOtpSchema,
} from "@/lib/validations/auth";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (_: LoginActionState, formData: FormData): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists" | "invalid_data";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface UserRegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists" | "invalid_data";
}

export const registerUser = async (
  _: UserRegisterActionState,
  formData: FormData,
): Promise<UserRegisterActionState> => {
  try {
    const formDataObj = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      lastname: formData.get("lastname"),
      confirmPassword: formData.get("confirmPassword"),
      phone: formData.get("phone"),
      country_id: formData.get("country_id"),
      depto_state_id: formData.get("depto_state_id"),
      city_municipality_id: formData.get("city_municipality_id"),
      role: "user" as const,
    };

    const validatedData = createRegisterUserSchema().parse(formDataObj);

    const [existingUser] = await getUser(validatedData.email);

    if (existingUser) {
      return { status: "user_exists" };
    }

    await createUserWithDetails({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      lastname: validatedData.lastname,
      role: validatedData.role,
      phone: validatedData.phone,
      country_id: validatedData.country_id,
      depto_state_id: validatedData.depto_state_id,
      city_municipality_id: validatedData.city_municipality_id,
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface LawyerRegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data"
    | "credential_exists"
    | "national_id_exists";
}

export const registerLawyer = async (
  _: LawyerRegisterActionState,
  formData: FormData,
): Promise<LawyerRegisterActionState> => {
  try {
    const formDataObj = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      lastname: formData.get("lastname"),
      confirmPassword: formData.get("confirmPassword"),
      lawyer_credential_number: formData.get("lawyer_credential_number") || undefined,
      national_id: formData.get("national_id"),
      phone: formData.get("phone"),
      country_id: formData.get("country_id"),
      depto_state_id: formData.get("depto_state_id"),
      city_municipality_id: formData.get("city_municipality_id"),
      role: "lawyer" as const,
    };

    const validatedData = createRegisterLawyerSchema().parse(formDataObj);

    const [existingUser] = await getUser(validatedData.email);

    if (existingUser) {
      return { status: "user_exists" };
    }

    await createUserWithDetails({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      lastname: validatedData.lastname,
      role: validatedData.role,
      lawyer_credential_number: validatedData.lawyer_credential_number,
      national_id: validatedData.national_id,
      phone: validatedData.phone,
      country_id: validatedData.country_id,
      depto_state_id: validatedData.depto_state_id,
      city_municipality_id: validatedData.city_municipality_id,
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    // Check for unique constraint violations
    if (error instanceof Error && error.message.includes("unique")) {
      if (error.message.includes("lawyer_credential")) {
        return { status: "credential_exists" };
      }
      if (error.message.includes("national_id")) {
        return { status: "national_id_exists" };
      }
    }

    return { status: "failed" };
  }
};

function generateOTP(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export interface ForgotPasswordActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data" | "user_not_found";
}

export const forgotPassword = async (
  _: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> => {
  try {
    const validatedData = createVerifyEmailSchema().parse({
      email: formData.get("email"),
    });

    // Check if user exists
    const [user] = await getUser(validatedData.email);
    if (!user) {
      return { status: "user_not_found" };
    }

    // Generate OTP
    const otp = generateOTP();

    // Save token to database
    await createPasswordResetToken({
      email: validatedData.email,
      token: otp,
    });

    // Send email
    await emailProvider.sendPasswordResetEmail(validatedData.email, otp);

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface VerifyOtpActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "invalid_code"
    | "expired_code"
    | "max_attempts";
}

export const verifyOtp = async (
  _: VerifyOtpActionState,
  formData: FormData,
): Promise<VerifyOtpActionState> => {
  try {
    const validatedData = createVerifyOtpSchema().parse({
      email: formData.get("email"),
      code: formData.get("code"),
    });

    // Get token from database
    const token = await getPasswordResetToken({
      email: validatedData.email,
      token: validatedData.code,
    });

    if (!token) {
      return { status: "invalid_code" };
    }

    // Check if expired
    if (token.expiresAt < new Date()) {
      return { status: "expired_code" };
    }

    // Check attempts
    const attempts = Number(token.attempts);
    if (attempts >= 3) {
      return { status: "max_attempts" };
    }

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    // Increment attempts on any error
    try {
      const email = formData.get("email") as string;
      const code = formData.get("code") as string;
      if (email && code) {
        await incrementPasswordResetAttempts({ email, token: code });
      }
    } catch {
      // Silently fail attempt increment
    }

    return { status: "failed" };
  }
};

export interface ResetPasswordActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "invalid_code"
    | "expired_code";
}

export const resetPassword = async (
  _: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> => {
  try {
    const validatedData = createResetPasswordSchema().parse({
      email: formData.get("email") as string,
      code: formData.get("code") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword"),
    });

    // Verify token one more time
    const token = await getPasswordResetToken({
      email: formData.get("email") as string,
      token: formData.get("code") as string,
    });

    if (!token) {
      return { status: "invalid_code" };
    }

    if (token.expiresAt < new Date()) {
      return { status: "expired_code" };
    }

    // Update password
    await updateUserPassword({
      email: formData.get("email") as string,
      password: validatedData.password,
    });

    // Delete the used token
    await deletePasswordResetToken({
      email: formData.get("email") as string,
      token: formData.get("code") as string,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
