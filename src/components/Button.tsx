import React, { useMemo, MouseEvent } from "react";
import { ColorType, Size, Spacing } from "@/components/types";
import Link from "next/link";

export type ButtonProps = {
  size?: Size;
  label: string;
  onClick?: ((e: MouseEvent<HTMLElement>) => void) | (() => void);
  fullWidth?: boolean;
  type?: "button" | "submit" | "buttonLink";
  colorType?: ColorType;
  href?: string;
  icon?: React.ReactNode;
  spaceAfter?: Spacing;
  disabled?: boolean;
  ariaLabel?: string;
};

const getSizeClasses = (size: Size, colorType: ColorType) => {
  switch (size) {
    case "small": {
      return `px-3.5 text-sm ${colorType === "secondary" ? "py-1.5" : "py-2"}`;
    }
    case "large": {
      return `px-6 text-lg ${colorType === "secondary" ? "py-2.5" : "py-3"}`;
    }
    default: {
      return `px-5 ${colorType === "secondary" ? "py-2" : "py-2.5"}`;
    }
  }
};

const getColorTypeClasses = (colorType: ColorType) => {
  switch (colorType) {
    case "secondary": {
      return "text-hkOrange border-2 border-hkOrange box-border";
    }
    case "tertiary": {
      return "text-hkOrange";
    }
    case "success": {
      return "text-white bg-green-500";
    }
    case "warning": {
      return "text-white bg-amber-500";
    }
    case "error": {
      return "text-white bg-red-500";
    }
    default: {
      return "text-white bg-hkOrange";
    }
  }
};
const getFullWidthClasses = (fullWidth: boolean) =>
  fullWidth ? "w-full" : "w-fit";

const getSpaceAfterClasses = (spaceAfter: Spacing | undefined) => {
  switch (spaceAfter) {
    case "small": {
      return "mb-1";
    }
    case "medium": {
      return "mb-3";
    }
    case "large": {
      return "mb-5";
    }
    default: {
      return "";
    }
  }
};

const getDisabledClassed = (disabled: boolean | undefined) => {
  if (disabled) {
    return "cursor-not-allowed opacity-60";
  }
  return "";
};

const BASE_BUTTON_CLASSES =
  "cursor-pointer rounded-md leading-none inline-block flex items-center";

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  size = "medium",
  label,
  onClick,
  fullWidth = false,
  href,
  type = "button",
  colorType = "primary",
  icon,
  spaceAfter,
  disabled,
  ariaLabel,
}: ButtonProps) => {
  const computedClasses = useMemo(() => {
    const modeClass = getColorTypeClasses(colorType);
    const sizeClass = getSizeClasses(size, colorType);
    const fullWidthClass = getFullWidthClasses(fullWidth);
    const spaceAfterClass = getSpaceAfterClasses(spaceAfter);
    const disabledClass = getDisabledClassed(disabled);

    return [
      sizeClass,
      fullWidthClass,
      spaceAfterClass,
      modeClass,
      disabledClass,
    ].join(" ");
  }, [colorType, size, fullWidth, spaceAfter, disabled]);

  if (type === "submit") {
    return (
      <input
        type="submit"
        className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
        value={label}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    );
  }

  if (type === "buttonLink") {
    return (
      <Link href={href as string} onClick={onClick} className="block w-fit">
        <button
          type="button"
          className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {icon}
          {label}
        </button>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
      {label}
    </button>
  );
};
