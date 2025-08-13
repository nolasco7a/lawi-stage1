import {FormInput, FormInputPhone, FormInputSelect} from "@/components/form-input";
import {Form} from "@/components/form";
import {RegisterLawyerFormData} from "@/lib/validations/auth";
import { getCountriesOptions, getDeptoStatesOptions, getCityMunicipalitiesOptions} from "@/lib/utils";
import {useCountryStateCitySelection} from "@/lib/hooks/useCountryStateCitySelection";

type LawyerFormProps = {
    form: any;
    callback: (data: RegisterLawyerFormData) => void;
    isLoading: boolean;
}
export default function LawyerForm({form, callback, isLoading}: LawyerFormProps) {
    console.log('LawyerForm - Current form values:', form.getValues());
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
            <FormInput
                form={form}
                name="name"
                label="Nombre"
                type="text"
                placeholder="Nombre"
            />
            <FormInput
                form={form}
                name="lastname"
                label="Apellido"
                type="text"
                placeholder="Apellido"
            />
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
                defaultCountry={'HN'}
            />
            <FormInput
                form={form}
                name="lawyer_credential_number"
                label="Credencial de Abogado"
                type="text"
                placeholder="Credencial de Abogado"
            />
            <FormInput
                form={form}
                name="national_id"
                label="Número de Identificación"
                type="text"
                placeholder="Número de Identificación"
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
                options={getCityMunicipalitiesOptions(cityMunicipalities, deptoStateId)}
                disabled={cityMunicipalities.length === 0}
            />
            <FormInput
                form={form}
                name="password"
                label="Contraseña"
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
    )
}