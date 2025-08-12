'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from '@/components/toast';
import { Form } from '@/components/form';
import { FormInput } from '@/components/form-input';
import { createVerifyEmailSchema, type VerifyEmailFormData } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { forgotPassword, type ForgotPasswordActionState } from '../actions';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(createVerifyEmailSchema()),
    defaultValues: {
      email: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<ForgotPasswordActionState, FormData>(
    forgotPassword,
    {
      status: 'idle',
    },
  );

  useEffect(() => {
    if (state.status === 'failed') {
      setIsLoading(false);
      toast({
        type: 'error',
        description: 'Failed to send reset email. Please try again.',
      });
    } else if (state.status === 'invalid_data') {
      setIsLoading(false);
      toast({
        type: 'error',
        description: 'Please enter a valid email address.',
      });
    } else if (state.status === 'user_not_found') {
      setIsLoading(false);
      toast({
        type: 'error',
        description: 'No account found with this email address.',
      });
    } else if (state.status === 'success') {
      setIsLoading(false);
      toast({
        type: 'success',
        description: 'Reset code sent! Check your email.',
      });
      router.push(`/forgot-password/verify?email=${encodeURIComponent(form.getValues('email'))}`);
    }
  }, [state.status, router, form]);

  const onSubmit = (data: VerifyEmailFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formAction(formData);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="h-10 w-full flex flex-row justify-start p-4">
        <Link href={'/login'} className="text-primary rounded-full">
          <Button variant="link" className="text-primary rounded-full pl-0">
            <ArrowLeft className="size-4" />
            Back to Login
          </Button>
        </Link>
      </div>
      <div className="h-full flex items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-zinc-50">Forgot Password</h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              Enter your email address and we&apos;ll send you a code to reset your password
            </p>
          </div>
          <Form
            onSubmit={form.handleSubmit(onSubmit)}
            isLoading={isLoading}
            form={form}
            buttonText="Send Reset Code"
          >
            <FormInput
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email address"
            />
          </Form>
        </div>
      </div>
    </div>
  );
}