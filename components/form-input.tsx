import { FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/phone-input";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  form: any;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
};

type FormInputPhoneProps = {
  form: any;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder: string;
  disabled?: boolean;
  defaultCountry?: string | undefined;
};

type FormInputSelectProps = {
  form: any;
  name: string;
  label: string;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  callback?: (value: string) => void;
};

export function FormInput({ form, name, label, type, placeholder, disabled }: FormInputProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">{label}</FormLabel>
          <FormControl>
            <Input
              className="text-primary border-muted-foreground"
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
}: FormInputSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary">{label}</FormLabel>
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
              <SelectTrigger className="text-primary border-muted-foreground w-full">
                <SelectValue placeholder={"Selecione una opción"} />
              </SelectTrigger>
              <SelectContent>
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
