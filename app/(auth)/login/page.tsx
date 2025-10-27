"use client";

import { Form } from "@/components/form";
import { FormInput } from "@/components/form-input";
import { toast } from "@/components/toast";
import { type LoginFormData, createLoginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { type LoginActionState, login } from "../actions";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(login, {
    status: "idle",
  });

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      updateSession()
        .then(() => {
          toast({
            type: "success",
            description: "Successfully logged in!",
          });
          // Check if there's a return URL for checkout flow
          const returnUrl = searchParams.get("returnUrl");
          if (returnUrl && returnUrl.startsWith("/checkout")) {
            router.push(returnUrl);
          } else {
            router.push("/chat");
          }
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, [state.status, router]);

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formAction(formData);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full flex flex-row justify-end p-4">
        <Link href={"/register"} className="text-primary rounded-full">
          <Button variant="link" className="text-primary rounded-full">
            Register
            <MoveRight className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Use your email and password to sign in
            </p>
          </div>
          <Form
            onSubmit={form.handleSubmit(onSubmit)}
            isLoading={isLoading}
            form={form}
            buttonText="Sign in"
          >
            <FormInput form={form} name="email" label="Email" type="email" placeholder="Email" />
            <FormInput
              form={form}
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
