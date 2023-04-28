import React, { useMemo } from "react";
import { Size } from "@/components/types";

export type ButtonProps = {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * How large should the button be?
   */
  size?: Size;
  /**
   * Button contents
   */
  label: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit";
};

const getSizeClasses = (size: Size) => {
  switch (size) {
    case "small": {
      return "px-4 py-2.5";
    }
    case "large": {
      return "px-6 py-3";
    }
    default: {
      return "px-5 py-2.5";
    }
  }
};

const getModeClasses = (isPrimary: boolean) =>
  isPrimary
    ? "text-white bg-hkOrange"
    : "text-hkOrange border-2 border-hkOrange";

const getFullWidthClasses = (fullWidth: boolean) =>
  fullWidth ? "w-full" : "w-fit";

const BASE_BUTTON_CLASSES =
  "cursor-pointer rounded-md font-bold leading-none inline-block";

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = true,
  size = "medium",
  label,
  onClick,
  fullWidth = false,
  type = "button",
}: ButtonProps) => {
  const computedClasses = useMemo(() => {
    const modeClass = getModeClasses(primary);
    const sizeClass = getSizeClasses(size);
    const fullWidthClass = getFullWidthClasses(fullWidth);

    return [modeClass, sizeClass, fullWidthClass].join(" ");
  }, [primary, size, fullWidth]);

  if (type === "submit") {
    return (
      <input
        type="submit"
        className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
        value={label}
        onClick={onClick}
      />
    );
  }

  return (
    <button
      type="button"
      className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
