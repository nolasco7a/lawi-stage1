'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState, useRef } from 'react';
import UserForm from "@/components/user-form";
import LawyerForm from "@/components/lawyer-form";

import {
  createRegisterUserSchema,
  createRegisterLawyerSchema,
  type RegisterUserFormData,
  type RegisterLawyerFormData,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';


import { registerUser, registerLawyer, type UserRegisterActionState, type LawyerRegisterActionState } from '../actions';
import { toast } from '@/components/toast';
import { useSession } from 'next-auth/react';
import { MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Page() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const hasRedirected = useRef(false);

  const [userState, userFormAction] = useActionState<UserRegisterActionState, FormData>(
    registerUser,
    {
      status: 'idle',
    },
  );

  const [lawyerState, lawyerFormAction] = useActionState<LawyerRegisterActionState, FormData>(
    registerLawyer,
    {
      status: 'idle',
    },
  );

  const { update: updateSession } = useSession();

  const userForm = useForm({
    resolver: zodResolver(createRegisterUserSchema()),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country_id: '',
      depto_state_id: '',
      city_municipality_id: '',
      role: 'user' as const,
    },
  });

  const lawyerForm = useForm({
    resolver: zodResolver(createRegisterLawyerSchema()),
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      country_id: '',
      depto_state_id: '',
      city_municipality_id: '',
      lawyer_credential_number: '',
      national_id: '',
      role: 'lawyer' as const,
    },
  });

  // Handle user registration state
  useEffect(() => {
    if (userState.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (userState.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create account!' });
    } else if (userState.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (userState.status === 'success' && !hasRedirected.current) {
      hasRedirected.current = true;
      toast({ type: 'success', description: 'User account created successfully!' });
      updateSession().then(() => {
        router.push('/login');
      }).catch(() => {
        router.push('/login');
      });
    }
  }, [userState.status, router, updateSession]);

  // Handle lawyer registration state
  useEffect(() => {
    if (lawyerState.status === 'user_exists') {
      toast({ type: 'error', description: 'Account already exists!' });
    } else if (lawyerState.status === 'failed') {
      toast({ type: 'error', description: 'Failed to create lawyer account!' });
    } else if (lawyerState.status === 'invalid_data') {
      toast({
        type: 'error',
        description: 'Failed validating your submission!',
      });
    } else if (lawyerState.status === 'credential_exists') {
      toast({ type: 'error', description: 'Lawyer credential already exists!' });
    } else if (lawyerState.status === 'national_id_exists') {
      toast({ type: 'error', description: 'National ID already exists!' });
    } else if (lawyerState.status === 'success' && !hasRedirected.current) {
      hasRedirected.current = true;
      toast({ type: 'success', description: 'Lawyer account created successfully!' });
      updateSession().then(() => {
        router.push('/login');
      }).catch(() => {
        router.push('/login');
      });
    }
  }, [lawyerState.status, router, updateSession]);

  const onUserSubmit = (data: RegisterUserFormData) => {
    console.log('User registration data:', data);
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    userFormAction(formData);
    setIsLoading(false);
  };

  const onLawyerSubmit = (data: RegisterLawyerFormData) => {
    console.log('Lawyer registration data:', data);
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });
    lawyerFormAction(formData);
    setIsLoading(false);
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
                  form={userForm}
                  isLoading={isLoading}
                  callback={onUserSubmit}
              />
          </TabsContent>
          <TabsContent value="lawyer">
            <div className="text-center text-2xl font-bold">lawyer</div>
            <LawyerForm
                form={lawyerForm}
                isLoading={isLoading}
                callback={onLawyerSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
