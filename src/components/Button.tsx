import React, { useMemo } from "react";
import { ColorType, Size } from "@/components/types";
import Link from "next/link";

export type ButtonProps = {
  size?: Size;
  label: string;
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit" | "buttonLink";
  colorType?: ColorType;
  href?: string;
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

const getColorTypeClasses = (colorType: ColorType) => {
  switch (colorType) {
    case "secondary": {
      return "text-hkOrange border-2 border-hkOrange";
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

const BASE_BUTTON_CLASSES =
  "cursor-pointer rounded-md font-bold leading-none inline-block";

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
}: ButtonProps) => {
  const computedClasses = useMemo(() => {
    const modeClass = getColorTypeClasses(colorType);
    const sizeClass = getSizeClasses(size);
    const fullWidthClass = getFullWidthClasses(fullWidth);

    return [modeClass, sizeClass, fullWidthClass].join(" ");
  }, [colorType, size, fullWidth]);

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

  const buttonComponent = (
    <button
      type="button"
      className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  if (type === "buttonLink") {
    return <Link href={href as string}>{buttonComponent}</Link>;
  }

  return buttonComponent;
};
