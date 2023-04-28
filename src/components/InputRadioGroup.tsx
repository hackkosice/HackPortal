import React, { useMemo } from "react";
import { Text } from "./Text";
import { Direction } from "@/components/types";

export type InputRadioGroupProps = {
  label?: string;
  required?: boolean;
  name: string;
  options: string[];
  direction?: Direction;
};

const getDirectionClasses = (direction?: Direction) => {
  switch (direction) {
    case "column":
      return "flex-col gap-1";
    default:
      return "flex-row gap-2";
  }
};

const LABEL_BASE_CLASSES = "block-inline text-sm text-slate-700 flex";
const INPUT_BASE_CLASSES =
  "w-fit mr-2 px-3 py-2 text-sm block-inline border rounded-md bg-white border-gray-300 text-gray-900 focus:outline-none";

export const InputRadioGroup = ({
  label,
  name,
  options,
  required,
  direction = "column",
}: InputRadioGroupProps) => {
  const computedClassesRadios = useMemo(() => {
    return getDirectionClasses(direction);
  }, [direction]);
  return (
    <>
      <span className={`${LABEL_BASE_CLASSES} mb-2`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <span className={`flex ${computedClassesRadios}`}>
        {options.map((option) => (
          <label className={LABEL_BASE_CLASSES} key={option}>
            <input type="radio" className={INPUT_BASE_CLASSES} name={name} />
            {option}
          </label>
        ))}
      </span>
    </>
  );
};
