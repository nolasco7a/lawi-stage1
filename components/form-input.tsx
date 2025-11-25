import { PhoneInput } from "@/components/phone-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { Country } from "react-phone-number-input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormInputProps = {
  // biome-ignore lint/suspicious/noExplicitAny: form is any type
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
  contrastColor?: boolean;
};

type FormInputPhoneProps = {
  // biome-ignore lint/suspicious/noExplicitAny: form is any type
  form: UseFormReturn<any>;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: Country;
  contrastColor?: boolean;
};

type FormInputSelectProps = {
  // biome-ignore lint/suspicious/noExplicitAny: form is any type
  form: UseFormReturn<any>;
  name: string;
  label: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  callback?: (value: string) => void;
  contrastColor?: boolean;
};

export function FormInput({
  form,
  name,
  label,
  type,
  placeholder,
  disabled,
  contrastColor,
}: FormInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={contrastColor ? "text-contrast" : "text-primary"}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              className={[
                contrastColor ? "text-contrast" : "text-primary",
                "focus:outline-none focus:ring-0 focus:border-0 focus:visible:ring-0",
              ].join(" ")}
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormInputPhone({
  form,
  name,
  label,
  defaultValue,
  placeholder,
  disabled,
  defaultCountry,
}: FormInputPhoneProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start">
          <FormLabel className="text-left">{label}</FormLabel>
          <FormControl className="w-full border-muted-foreground border rounded-md">
            <PhoneInput
              placeholder={placeholder}
              {...field}
              value={defaultValue}
              disabled={disabled}
              defaultCountry={defaultCountry}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormInputSelect({
  form,
  name,
  label,
  options = [],
  disabled = false,
  callback,
  contrastColor = false,
}: FormInputSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={contrastColor ? "text-contrast" : "text-primary"}>
            {label}
          </FormLabel>
          <FormControl>
            <Select
              disabled={disabled}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                if (callback) {
                  callback(value);
                }
              }}
            >
              <SelectTrigger
                className={
                  contrastColor
                    ? "text-contrast border-muted-foreground w-full"
                    : "text-primary border-muted-foreground w-full"
                }
              >
                <SelectValue placeholder={"Selecione una opción"} />
              </SelectTrigger>
              <SelectContent className={contrastColor ? "text-contrast" : "text-primary"}>
                {options.length > 0
                  ? options?.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
