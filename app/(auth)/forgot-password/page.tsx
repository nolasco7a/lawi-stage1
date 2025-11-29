"use client";

import { Form } from "@/components/form";
import { FormInput } from "@/components/form-input";
import { toast } from "@/components/toast";
import { type VerifyEmailFormData, createVerifyEmailSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HeaderAuthForm from "../components/header-auth-form";
import TemplateSide from "../components/template-side";

import { type ForgotPasswordActionState, forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(createVerifyEmailSchema()),
    defaultValues: {
      email: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<ForgotPasswordActionState, FormData>(forgotPassword, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "failed") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Failed to send reset email. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Please enter a valid email address.",
      });
    } else if (state.status === "user_not_found") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "No account found with this email address.",
      });
    } else if (state.status === "success") {
      setIsLoading(false);
      toast({
        type: "success",
        description: "Reset code sent! Check your email.",
      });
      router.push(`/forgot-password/verify?email=${encodeURIComponent(form.getValues("email"))}`);
    }
  }, [state.status, router, form]);

  const onSubmit = (data: VerifyEmailFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formAction(formData);
  };

  return (
    <TemplateSide textLink="Volver al login" hrefLink="/login" adornmentSide="left">
      <div className="h-full w-full flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <HeaderAuthForm
            title="¿Olvidaste tu contraseña?"
            subtitle="Ingresa tu email y te enviaremos un código para resetear tu contraseña"
          />
          <Form
            onPressAction={form.handleSubmit(onSubmit)}
            isLoading={isLoading}
            form={form}
            buttonText="Enviar código de reseteo"
            contrastColor={true}
          >
            <FormInput
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
              contrastColor={true}
            />
          </Form>
        </div>
      </div>
    </TemplateSide>
  );
}
