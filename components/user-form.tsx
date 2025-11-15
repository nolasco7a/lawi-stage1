import { useCountryStateCitySelection } from "@/lib/hooks/useCountryStateCitySelection";
import {
  getCityMunicipalitiesOptions,
  getCountriesOptions,
  getDeptoStatesOptions,
} from "@/lib/utils";
import type { RegisterUserFormData } from "@/lib/validations/auth";
import { Form } from "./form";
import { FormInput, FormInputPhone, FormInputSelect } from "./form-input";

type UserFormProps = {
  form: typeof Form extends { prototype: infer U } ? U : never;
  isLoading: boolean;
  callback: (data: RegisterUserFormData) => void;
};
export default function UserForm({ form, isLoading, callback }: Readonly<UserFormProps>) {
  const {
    onCountryChange,
    onStateChange,
    deptoStateId,
    countries,
    deptoStates,
    cityMunicipalities,
  } = useCountryStateCitySelection();

  return (
    <Form
      onSubmit={form.handleSubmit(callback)}
      isLoading={isLoading}
      form={form}
      buttonText="Sign Up"
    >
      <FormInput form={form} name="name" label="Nombre" type="text" placeholder="Name" />
      <FormInput form={form} name="lastname" label="Apellido" type="text" placeholder="Apellido" />
      <FormInput
        form={form}
        name="email"
        label="Correo electronico"
        type="email"
        placeholder="Correo electronico"
      />
      <FormInputPhone
        form={form}
        name="phone"
        label="Número de Teléfono"
        placeholder="Phone"
        disabled={false}
        defaultCountry={"HN"}
      />
      <FormInputSelect
        form={form}
        name="country_id"
        label="País"
        options={getCountriesOptions(countries)}
        callback={(value: string) => {
          onCountryChange(value);
        }}
      />
      <FormInputSelect
        form={form}
        name="depto_state_id"
        label="Departamento"
        options={getDeptoStatesOptions(deptoStates)}
        disabled={deptoStates.length === 0}
        callback={(value: string) => {
          onStateChange(value);
        }}
      />
      <FormInputSelect
        form={form}
        name="city_municipality_id"
        label="Ciudad ó Municipio"
        options={getCityMunicipalitiesOptions(cityMunicipalities, deptoStateId as string)}
        disabled={cityMunicipalities.length === 0}
      />
      <FormInput
        form={form}
        name="password"
        label="Password"
        type="password"
        placeholder="Contraseña"
      />
      <FormInput
        form={form}
        name="confirmPassword"
        label="Confirmar Contraseña"
        type="password"
        placeholder="Confirmar Contraseña"
      />
    </Form>
  );
}
