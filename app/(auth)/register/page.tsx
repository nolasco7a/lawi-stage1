'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState, useRef } from 'react';
import UserForm from "@/components/user-form";
import LawyerForm from "@/components/lawyer-form";

import {
  createRegisterSchema,
  type RegisterFormData,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { SubmitButton } from '@/components/submit-button';

import { register, type RegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';
import { MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasRedirected = useRef(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(createRegisterSchema()),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (state.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (state.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
    } else if (state.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (state.status === 'success' && !hasRedirected.current) {
      hasRedirected.current = true;
      toast({ type: 'success', description: 'Account created successfully!' });

      // Update session and then redirect
      updateSession().then(() => {
        router.push('/login');
      }).catch(() => {
        // if the session update fails, we still want to redirect
        router.push('/login');
      });
    }
  }, [state.status, router]);

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="h-10 w-full flex flex-row justify-end p-4">
        <Link href={'/login'} className="text-primary rounded-full">
          <Button variant="link" className="text-primary rounded-full">
            Login
            <MoveRight className="size-4" />
          </Button>
        </Link>
      </div>
      <div className="size-full flex items-center justify-center px-5">
        <Tabs defaultValue="user" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="lawyer">Lawyer</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <div className="text-center text-2xl font-bold">User</div>
              <UserForm
                  form={form}
                  isLoading={isLoading}
                  callback={onSubmit}
              />
          </TabsContent>
          <TabsContent value="lawyer">
            <div className="text-center text-2xl font-bold">lawyer</div>
            <LawyerForm
                form={form}
                isLoading={isLoading}
                callback={onSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
