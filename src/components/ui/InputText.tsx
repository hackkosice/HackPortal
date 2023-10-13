import React, { useId } from "react";
import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type InputTextTypes = "text" | "email" | "password";

export type InputTextProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: InputTextTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  name?: string;
  error?: string;
  registerOptions?: RegisterOptions;
};

export const InputText = ({
  label,
  placeholder,
  required,
  type = "text",
  register,
  name,
  error,
  registerOptions,
}: InputTextProps) => {
  const registerProps =
    register && name
      ? register(name, { required, ...registerOptions })
      : undefined;
  const id = useId();
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        {...registerProps}
      />
      {error && <span className="block text-red-500 mt-1">{error}</span>}
    </div>
  );
};
