import React from "react";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

export type InputCheckboxProps = {
  label?: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  name?: string;
  error?: string;
  registerOptions?: RegisterOptions;
};

const getFocusClasses = (error: string | undefined) => {
  if (error) {
    return "focus:ring-red-500 focus:border-red-500 border-red-500";
  }
  return "focus:ring-hkOrange focus:border-hkOrange";
};

const LABEL_BASE_CLASSES =
  "block-inline text-sm text-slate-700 flex align-center";
const INPUT_BASE_CLASSES =
  "w-fit mr-2 text-sm block-inline border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none";

export const InputCheckbox = ({
  label,
  required,
  register,
  name,
  error,
  registerOptions,
}: InputCheckboxProps) => {
  const registerProps =
    register && name ? register(name, { required, ...registerOptions }) : {};
  return (
    <>
      <label className={LABEL_BASE_CLASSES}>
        <input
          type="checkbox"
          required={required}
          className={`${INPUT_BASE_CLASSES} ${getFocusClasses(error)}`}
          {...registerProps}
        />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {error && <span className="block text-red-500 text-sm">{error}</span>}
    </>
  );
};
