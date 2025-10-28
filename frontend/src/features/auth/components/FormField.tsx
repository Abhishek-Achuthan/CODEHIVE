import { memo } from 'react';
import type { FieldValues, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { FieldComponentProps, FormFieldProps } from '../../../shared/types/authTypes';

interface RHFFormFieldProps<T extends FieldValues> {
  field: FormFieldProps<T>['field'];
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

function FormFieldBase<T extends FieldValues>({
  field,
  register,
  errors,
}: RHFFormFieldProps<T>) {
  const InputComponent = field.component || 'input';
  const errorMessage = errors[field.name]?.message as string | undefined;

  const inputProps: FieldComponentProps = {
    id: String(field.name),
    placeholder: field.placeholder,
    type: field.type || 'text',
    className:
      'h-10 w-full rounded-lg border border-white10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20',
    ...register(field.name),
  };

  return (
    <div className="space-y-2">
      <label htmlFor={String(field.name)} className="text-xs text-white/70">
        {field.label}
      </label>
      <InputComponent {...inputProps} />
      {errorMessage && <p className="text-xs text-red-400">{errorMessage}</p>}
    </div>
  );
}

export const FormField = memo(FormFieldBase) as typeof FormFieldBase;
