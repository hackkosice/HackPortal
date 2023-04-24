import React from "react";

export type InputTextTypes = "text" | "email" | "password";

export type InputTextProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: InputTextTypes;
};

const LABEL_BASE_CLASSES = "block text-sm text-slate-700";
const INPUT_BASE_CLASSES =
  "w-full mt-1 px-3 py-2 text-sm block border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-hkOrange focus:border-hkOrange";

export const InputText = ({
  label,
  placeholder,
  required,
  type = "text",
}: InputTextProps) => {
  return (
    <label className={LABEL_BASE_CLASSES}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className={INPUT_BASE_CLASSES}
      />
    </label>
  );
};
