"use client";

import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { type VerifyOtpActionState, verifyOtp } from "../../actions";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<VerifyOtpActionState, FormData>(verifyOtp, {
    status: "idle",
  });

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }
  }, [email, router]);

  useEffect(() => {
    if (state.status === "failed") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Failed to verify code. Please try again.",
      });
    } else if (state.status === "invalid_data") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Please enter a valid 8-digit code.",
      });
    } else if (state.status === "invalid_code") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Invalid verification code. Please check and try again.",
      });
    } else if (state.status === "expired_code") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "This code has expired. Please request a new one.",
      });
    } else if (state.status === "max_attempts") {
      setIsLoading(false);
      toast({
        type: "error",
        description: "Too many failed attempts. Please request a new code.",
      });
    } else if (state.status === "success") {
      setIsLoading(false);
      toast({
        type: "success",
        description: "Code verified successfully!",
      });
      router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&code=${code}`);
    }
  }, [state.status, router, email, code]);

  const handleSubmit = () => {
    if (code.length !== 8) {
      toast({
        type: "error",
        description: "Please enter the complete 8-digit code.",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("code", code);
    formAction(formData);
  };

  const handleResendCode = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full flex flex-row justify-start p-4">
        <Link href={"/forgot-password"} className="text-primary rounded-full">
          <Button variant="link" className="text-primary rounded-full pl-0">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
      </div>
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Verify Code</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              We sent a 8-digit code to {email}
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">Code expires in 15 minutes</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <InputOTP maxLength={8} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || code.length !== 8}
              className="w-full mt-4 bg-primary/15 text-primary hover:bg-primary/20"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Didn&apos;t receive a code?{" "}
                <button
                  onClick={handleResendCode}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                  type="button"
                >
                  Send new code
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
