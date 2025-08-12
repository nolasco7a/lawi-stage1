import {
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PhoneInput } from '@/components/phone-input';
import { Input } from '@/components/ui/input';

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
};

type FormInputSelectProps = {
    form: any;
    name: string;
    label: string;
    disabled?: boolean;
    options?: {value: string, label: string}[];
}

export function FormInput({
  form,
  name,
  label,
  type,
  placeholder,
  disabled,
}: FormInputProps) {
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
  label,
  defaultValue,
  placeholder,
  disabled,
}: FormInputPhoneProps) {
  return (
    <FormField
      control={form.control}
      name="phone"
      render={({ field }) => (
        <FormItem className="flex flex-col items-start">
          <FormLabel className="text-left">{label}</FormLabel>
          <FormControl className="w-full border-muted-foreground border rounded-md">
            <PhoneInput
              placeholder={placeholder}
              {...field}
              value={defaultValue}
              disabled={disabled}
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
    options = []
}: FormInputSelectProps) {
    return (
    <FormField
        control={form.control}
        name={name}
        render={() => (
            <FormItem>
                <FormLabel className="text-primary">{label}</FormLabel>
                <FormControl>
                    <Select>
                        <SelectTrigger className="text-primary border-muted-foreground w-full">
                            <SelectValue placeholder={options[0].value} />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                options?.map((item, index) => (
                                    <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
    )
}
