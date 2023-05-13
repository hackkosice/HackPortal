import React from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

export type InputSelectProps = {
  label: string;
  options: string[];
  error?: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  name?: string;
  registerOptions?: RegisterOptions;
};

const getFocusClasses = (error: string | undefined) => {
  if (error) {
    return "focus:ring-red-500 focus:border-red-500 border-red-500";
  }
  return "focus:ring-hkOrange focus:border-hkOrange";
};

const LABEL_BASE_CLASSES = "block text-sm text-slate-700";
const INPUT_BASE_CLASSES =
  "w-96 mt-1 px-3 py-2 text-sm block border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1";

export const InputSelect = ({
  label,
  options,
  error,
  required,
  register,
  name,
  registerOptions,
}: InputSelectProps) => {
  const registerProps =
    register && name ? register(name, { required, ...registerOptions }) : {};

  return (
    <label className={LABEL_BASE_CLASSES}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      <select
        required={required}
        className={`${INPUT_BASE_CLASSES} ${getFocusClasses(error)}`}
        {...registerProps}
      >
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="block text-red-500 mt-1">{error}</span>}
    </label>
  );
};
