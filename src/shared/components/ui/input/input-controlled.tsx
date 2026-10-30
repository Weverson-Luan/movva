/**
 * IMPORTS
 */
import { Controller, type FieldValues } from "react-hook-form";

// typings
import { Input } from "./index";
import type { InputControlledProps } from "./interface";

// Input ligado ao react-hook-form: valor, mudança, blur e mensagem de erro vêm do formulário.
const InputControlled = <T extends FieldValues>({ control, name, ...inputProps }: InputControlledProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <Input {...inputProps} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
      )}
    />
  );
};

/**
 * EXPORTS
 */
export { InputControlled };
