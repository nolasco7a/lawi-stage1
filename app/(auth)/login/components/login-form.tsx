import { Form } from "@/components/form";
import { FormInput } from "@/components/form-input";
import { toast } from "@/components/toast";
import { FAILED_STATUS, INVALID_DATA_STATUS, SUCCESS_STATUS } from "@/constants/app";
import { type LoginFormData, createLoginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useActionState, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type LoginActionState, login } from "../../actions";
import HeaderAuthForm from "../../components/header-auth-form";

export default function LoginForm() {
  // === context & states
  const [isLoading, setIsLoading] = useState(false);
  const { update: updateSession } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // === action state
  const [state, formAction] = useActionState<LoginActionState, FormData>(login, {
    status: "idle",
  });

  // === Validation
  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // === Handlers
  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formAction(formData);
  };

  // === effects
  useEffect(() => {
    if (state.status === FAILED_STATUS) {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === INVALID_DATA_STATUS) {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === SUCCESS_STATUS) {
      updateSession()
        .then(() => {
          toast({
            type: "success",
            description: "Successfully logged in!",
          });
          const returnUrl = searchParams.get("returnUrl");
          if (returnUrl?.startsWith("/checkout")) {
            router.push(returnUrl);
          } else {
            router.push("/chat");
          }
        })
        .catch((error) => {
          console.error("Failed to update session:", error);
          setIsLoading(false);
        });
    }
  }, [state.status, router, updateSession, searchParams]);

  return (
    <div className="h-full w-full flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <HeaderAuthForm
          title="Iniciar sesión"
          subtitle="Utiliza tu email y contraseña para iniciar sesión"
        />
        <Form
          onPressAction={() => form.handleSubmit(onSubmit)()}
          isLoading={isLoading}
          form={form}
          buttonText="Iniciar sesión"
          contrastColor={true}
        >
          <FormInput
            form={form}
            name="email"
            label="Correo electrónico"
            type="email"
            placeholder="Correo electrónico"
            contrastColor={true}
          />

          <FormInput
            form={form}
            name="password"
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            contrastColor={true}
          />
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-contrast hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
