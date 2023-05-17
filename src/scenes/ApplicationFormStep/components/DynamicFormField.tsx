/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { InputText } from "@/components/InputText";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { InputSelect, OptionType } from "@/components/InputSelect";
import { InputTextarea } from "@/components/InputTextarea";
import { InputCheckbox } from "@/components/InputCheckbox";

export type Props = {
  label: string;
  type: string;
  required?: boolean;
  register?: UseFormRegister<any>;
  name?: string;
  error?: string;
  registerOptions?: RegisterOptions;
  options?: OptionType[];
};

const DynamicFormField = ({
  label,
  type,
  name,
  error,
  registerOptions,
  register,
  required,
  options,
}: Props) => {
  switch (type) {
    case "text":
      return (
        <InputText
          label={label}
          name={name}
          register={register}
          registerOptions={registerOptions}
          error={error}
          required={required}
        />
      );
    case "textarea":
      return (
        <InputTextarea
          label={label}
          name={name}
          register={register}
          registerOptions={registerOptions}
          error={error}
          required={required}
        />
      );
    case "select":
      return (
        <InputSelect
          label={label}
          options={options ?? []}
          name={name}
          register={register}
          registerOptions={registerOptions}
          error={error}
          required={required}
        />
      );
    case "checkbox":
      return (
        <InputCheckbox
          label={label}
          name={name}
          register={register}
          registerOptions={registerOptions}
          error={error}
          required={required}
        />
      );
  }
  return null;
};

export default DynamicFormField;
