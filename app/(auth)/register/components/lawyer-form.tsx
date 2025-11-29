import { Form } from "@/components/form";
import { FormInput, FormInputPhone, FormInputSelect } from "@/components/form-input";
import { useCountryStateCitySelection } from "@/lib/hooks/useCountryStateCitySelection";
import {
  getCityMunicipalitiesOptions,
  getCountriesOptions,
  getDeptoStatesOptions,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

import { type RegisterLawyerFormData, createRegisterLawyerSchema } from "@/lib/validations/auth";

import { type LawyerRegisterActionState, registerLawyer } from "@/app/(auth)/actions";
import { toast } from "@/components/toast";
import { useSession } from "next-auth/react";

export default function LawyerForm() {
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
  const processedStatusRef = useRef<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [lawyerState, lawyerFormAction] = useActionState<LawyerRegisterActionState, FormData>(
    registerLawyer,
    {
      status: "idle",
    },
  );

  // === validation
  const lawyerForm = useForm({
    resolver: zodResolver(createRegisterLawyerSchema()),
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
      lawyer_credential_number: "",
      national_id: "",
      role: "lawyer" as const,
    },
  });

  // === effects
  useEffect(() => {
    // Evitar procesar el mismo status múltiples veces
    if (lawyerState.status === "idle" || processedStatusRef.current === lawyerState.status) {
      return;
    }

    processedStatusRef.current = lawyerState.status;

    if (lawyerState.status === "user_exists") {
      toast({ type: "error", description: "Account already exists!" });
    } else if (lawyerState.status === "failed") {
      toast({ type: "error", description: "Failed to create lawyer account!" });
    } else if (lawyerState.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (lawyerState.status === "credential_exists") {
      toast({
        type: "error",
        description: "Lawyer credential already exists!",
      });
    } else if (lawyerState.status === "national_id_exists") {
      toast({ type: "error", description: "National ID already exists!" });
    } else if (lawyerState.status === "success") {
      toast({
        type: "success",
        description: "Lawyer account created successfully!",
      });
      updateSession()
        .then(() => {
          router.push("/login");
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [lawyerState.status, router, updateSession]);

  // === handlers
  const onLawyerSubmit = (data: RegisterLawyerFormData) => {
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

  // MARK: - Render
  return (
    <Form
      onPressAction={lawyerForm.handleSubmit(onLawyerSubmit)}
      isLoading={isLoading}
      form={lawyerForm}
      buttonText="Registrarse"
      contrastColor={true}
    >
      <FormInput
        form={lawyerForm}
        name="name"
        label="Nombre"
        type="text"
        placeholder="Nombre"
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="lastname"
        label="Apellido"
        type="text"
        placeholder="Apellido"
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="email"
        label="Correo electronico"
        type="email"
        placeholder="Correo electronico"
        contrastColor={true}
      />
      <FormInputPhone
        form={lawyerForm}
        name="phone"
        label="Número de Teléfono"
        placeholder="Phone"
        disabled={false}
        defaultCountry={"HN"}
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="lawyer_credential_number"
        label="Credencial de Abogado"
        type="text"
        placeholder="Credencial de Abogado"
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="national_id"
        label="Número de Identificación"
        type="text"
        placeholder="Número de Identificación"
        contrastColor={true}
      />
      <FormInputSelect
        form={lawyerForm}
        name="country_id"
        label="País"
        options={getCountriesOptions(countries)}
        callback={(value: string) => {
          onCountryChange(value);
        }}
        contrastColor={true}
      />
      <FormInputSelect
        form={lawyerForm}
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
        form={lawyerForm}
        name="city_municipality_id"
        label="Ciudad ó Municipio"
        options={getCityMunicipalitiesOptions(cityMunicipalities, deptoStateId as string)}
        disabled={cityMunicipalities.length === 0}
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="password"
        label="Contraseña"
        type="password"
        placeholder="Contraseña"
        contrastColor={true}
      />
      <FormInput
        form={lawyerForm}
        name="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        placeholder="Confirmar Contraseña"
        contrastColor={true}
      />
    </Form>
  );
}
