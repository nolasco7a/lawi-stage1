"use client";

import { Form } from "@/components/form";
import { FormInput, FormInputPhone, FormInputSelect } from "@/components/form-input";
import { useCountryStateCitySelection } from "@/lib/hooks/useCountryStateCitySelection";
import {
  getCityMunicipalitiesOptions,
  getCountriesOptions,
  getDeptoStatesOptions,
} from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import { type RegisterUserFormData, createRegisterUserSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { type UserRegisterActionState, registerUser } from "@/app/(auth)/actions";
import { toast } from "@/components/toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

export default function UserForm() {
  // === context & states
  const {
    onCountryChange,
    onStateChange,
    deptoStateId,
    countries,
    deptoStates,
    cityMunicipalities,
  } = useCountryStateCitySelection();
  const { update: updateSession } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [userState, userFormAction] = useActionState<UserRegisterActionState, FormData>(
    registerUser,
    { status: "idle" },
  );

  // === validation
  const userForm = useForm({
    resolver: zodResolver(createRegisterUserSchema()),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      country_id: "",
      depto_state_id: "",
      city_municipality_id: "",
      role: "user" as const,
    },
  });

  // === effects
  useEffect(() => {
    if (userState.status === "user_exists") {
      toast({ type: "error", description: "Account already exists!" });
    } else if (userState.status === "failed") {
      toast({ type: "error", description: "Failed to create account!" });
    } else if (userState.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (userState.status === "success") {
      toast({
        type: "success",
        description: "User account created successfully!",
      });
      updateSession()
        .then(() => {
          router.push("/login");
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [userState.status, router, updateSession]);

  // === handlers
  const onUserSubmit = (data: RegisterUserFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    userFormAction(formData);
    setIsLoading(false);
  };

  return (
    <Form
      onPressAction={() => userForm.handleSubmit(onUserSubmit)()}
      isLoading={isLoading}
      form={userForm}
      buttonText="Registrarse"
      contrastColor={true}
    >
      <FormInput
        form={userForm}
        name="name"
        label="Nombre"
        type="text"
        placeholder="Name"
        contrastColor={true}
      />
      <FormInput
        form={userForm}
        name="lastname"
        label="Apellido"
        type="text"
        placeholder="Apellido"
        contrastColor={true}
      />
      <FormInput
        form={userForm}
        name="email"
        label="Correo electronico"
        type="email"
        placeholder="Correo electronico"
        contrastColor={true}
      />
      <FormInputPhone
        form={userForm}
        name="phone"
        label="Número de Teléfono"
        placeholder="Phone"
        disabled={false}
        defaultCountry={"HN"}
        contrastColor={true}
      />
      <FormInputSelect
        form={userForm}
        name="country_id"
        label="País"
        options={getCountriesOptions(countries)}
        callback={(value: string) => {
          onCountryChange(value);
        }}
        contrastColor={true}
      />
      <FormInputSelect
        form={userForm}
        name="depto_state_id"
        label="Departamento"
        options={getDeptoStatesOptions(deptoStates)}
        disabled={deptoStates.length === 0}
        callback={(value: string) => {
          onStateChange(value);
        }}
        contrastColor={true}
      />
      <FormInputSelect
        form={userForm}
        name="city_municipality_id"
        label="Ciudad ó Municipio"
        options={getCityMunicipalitiesOptions(cityMunicipalities, deptoStateId as string)}
        disabled={cityMunicipalities.length === 0}
        contrastColor={true}
      />
      <FormInput
        form={userForm}
        name="password"
        label="Password"
        type="password"
        placeholder="Contraseña"
        contrastColor={true}
      />
      <FormInput
        form={userForm}
        name="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        placeholder="Confirmar Contraseña"
        contrastColor={true}
      />
    </Form>
  );
}
