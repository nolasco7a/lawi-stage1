import {FormInput} from "@/components/form-input";
import {Form} from "@/components/form";
import {RegisterFormData} from "@/lib/validations/auth";

type UserFormProps = {
    form: any;
    callback: (data: RegisterFormData) => void;
    isLoading: boolean;
}
export default function UserForm({form, callback, isLoading}: UserFormProps) {
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