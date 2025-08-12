import React from 'react';
import { Form } from './form';
import { FormInput, FormInputPhone, FormInputSelect } from './form-input';
import {RegisterFormData} from "@/lib/validations/auth";

type userFormProps = {
    form: any
    isLoading: boolean
    callback: (data: RegisterFormData) => void
}
export default function UserForm({form, isLoading, callback}: userFormProps) {
    return(
        <Form
            onSubmit={form.handleSubmit(callback)}
            isLoading={isLoading}
            form={form}
            buttonText="Sign Up"
        >
            <FormInput
                form={form}
                name="name"
                label="Name"
                type="text"
                placeholder="Name"
            />
            <FormInput
                form={form}
                name="lastname"
                label="Lastname"
                type="text"
                placeholder="Lastname"
            />
            <FormInput
                form={form}
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
            />
            <FormInputPhone
                form={form}
                name={""}
                label="Phone"
                defaultValue="+504"
                placeholder="Phone"
                disabled={false}
            />

            <FormInputSelect
                form={form}
                name="City"
                label="City"
                options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
            /><FormInputSelect
            form={form}
            name="City"
            label="City"
            options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
        /><FormInputSelect
            form={form}
            name="City"
            label="City"
            options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
        /> <FormInputSelect
            form={form}
            name="City"
            label="City"
            options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
        /><FormInputSelect
            form={form}
            name="City"
            label="City"
            options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
        /><FormInputSelect
            form={form}
            name="City"
            label="City"
            options={[{label: 'New York', value: 'new_york'}, {label: 'Los Angeles', value: 'los_angeles'}, {label: 'Chicago', value: 'chicago'}]}
        />
            <FormInput
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="Password"
            />
            <FormInput
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm Password"
            />
        </Form>
    )
}