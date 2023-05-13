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
};

const getSizeClasses = (size: Size) => {
  switch (size) {
    case "small": {
      return "px-3.5 py-2 text-sm";
    }
    case "large": {
      return "px-6 py-3 text-lg";
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

const BASE_BUTTON_CLASSES =
  "cursor-pointer rounded-md font-bold leading-none inline-block flex items-center";

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
}: ButtonProps) => {
  const computedClasses = useMemo(() => {
    const modeClass = getColorTypeClasses(colorType);
    const sizeClass = getSizeClasses(size);
    const fullWidthClass = getFullWidthClasses(fullWidth);
    const spaceAfterClass = getSpaceAfterClasses(spaceAfter);

    return [modeClass, sizeClass, fullWidthClass, spaceAfterClass].join(" ");
  }, [colorType, size, fullWidth, spaceAfter]);

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

  if (type === "buttonLink") {
    return (
      <Link href={href as string} onClick={onClick} className="block w-fit">
        <button
          type="button"
          className={`${BASE_BUTTON_CLASSES} ${computedClasses}`}
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
    >
      {icon}
      {label}
    </button>
  );
};
