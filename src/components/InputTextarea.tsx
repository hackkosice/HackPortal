import React from "react";

export type InputTextareaProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

const LABEL_BASE_CLASSES = "block text-sm text-slate-700";
const TEXTAREA_BASE_CLASSES =
  "w-full mt-1 px-3 py-2 text-sm block border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none focus:ring-1 focus:ring-hkOrange focus:border-hkOrange";

export const InputTextarea = ({
  label,
  placeholder,
  required,
  rows = 3,
}: InputTextareaProps) => {
  return (
    <label className={LABEL_BASE_CLASSES}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
      <textarea
        required={required}
        placeholder={placeholder}
        className={TEXTAREA_BASE_CLASSES}
        rows={rows}
      />
    </label>
  );
};
