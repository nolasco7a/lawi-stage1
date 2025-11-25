"use client";

import { Form } from "@/components/form";
import { FormInput } from "@/components/form-input";
import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { type ResetPasswordFormData, createResetPasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { type ResetPasswordActionState, resetPassword } from "../../actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordSchema()),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<ResetPasswordActionState, FormData>(resetPassword, {
    status: "idle",
  });

  useEffect(() => {
    if (!email || !code) {
      router.push("/forgot-password");
      return;
    }
  }, [email, code, router]);

  useEffect(() => {
    if (state.status === "failed") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Failed to reset password. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Please check your password requirements.",
      });
    } else if (state.status === "invalid_code") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Invalid verification code.",
      });
    } else if (state.status === "expired_code") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Code has expired. Please request a new one.",
      });
    } else if (state.status === "success") {
      setIsLoading(false);
      toast({
        type: "success",
        description: "Password reset successfully! You can now log in.",
      });
      router.push("/login");
    }
  }, [state.status, router]);

  const onSubmit = (data: ResetPasswordFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", code);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formAction(formData);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full flex flex-row justify-start p-4">
        <Link
          href={`/forgot-password/verify?email=${encodeURIComponent(email)}`}
          className="text-primary rounded-full"
        >
          <Button variant="link" className="text-primary rounded-full pl-0">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
      </div>
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Reset Password</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Enter your new password for {email}
            </p>
          </div>
          <Form
            onPressAction={() => form.handleSubmit(onSubmit)()}
            isLoading={isLoading}
            form={form}
            buttonText="Reset Password"
          >
            <FormInput
              form={form}
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
            />
            <FormInput
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
            />
            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              Password must be at least 8 characters and include uppercase, lowercase, number, and
              special character.
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
