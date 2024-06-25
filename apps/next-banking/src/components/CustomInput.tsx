import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  Input,
} from '@djwingfield/shadcn-ui';
import { HTMLInputTypeAttribute } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface CustomInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  formControl: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
}

const CustomInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  formControl,
  name,
  label,
  placeholder,
  type = 'text',
}: CustomInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={type}
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
