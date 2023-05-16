import React from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputTextareaProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
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

const LABEL_BASE_CLASSES = "block text-sm text-slate-700";
const TEXTAREA_BASE_CLASSES =
  "w-96 mt-1 px-3 py-2 text-sm block border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-hkOrange focus:border-hkOrange";

export const InputTextarea = ({
  label,
  placeholder,
  required,
  rows = 3,
  register,
  name,
  error,
  registerOptions,
}: InputTextareaProps) => {
  const registerProps =
    register && name ? register(name, { required, ...registerOptions }) : {};
  return (
    <label className={LABEL_BASE_CLASSES}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      <textarea
        required={required}
        placeholder={placeholder}
        className={`${TEXTAREA_BASE_CLASSES} ${getFocusClasses(error)}`}
        rows={rows}
        {...registerProps}
      />
      {error && <span className="block text-red-500 mt-1">{error}</span>}
    </label>
  );
};
