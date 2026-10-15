import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { InputField, type InputFieldProps } from '../InputField';

export interface CampoTextoProps<T extends FieldValues>
  extends Omit<InputFieldProps, 'value' | 'onChangeText' | 'onBlur' | 'error' | 'ref'> {
  control: Control<T>;
  name: Path<T>;
}

/** InputField conectado a React Hook Form: el error de Zod sale abajo del campo */
export function CampoTexto<T extends FieldValues>({ control, name, ...props }: CampoTextoProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, value, onChange, onBlur }, fieldState: { error } }) => (
        <InputField
          ref={ref}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
