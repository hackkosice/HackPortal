import React, { PropsWithChildren, useMemo } from "react";
import { ColorType, Size, Spacing } from "@/components/types";

export type TextProps = PropsWithChildren<{
  size?: Size;
  spaceAfter?: Spacing;
  type?: ColorType;
}>;

const getSizeClasses = (size: Size | undefined) => {
  switch (size) {
    case "small": {
      return "text-sm";
    }
    case "large": {
      return "text-lg";
    }
    default: {
      return "text-base";
    }
  }
};

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

const getTypeClasses = (type: ColorType | undefined) => {
  switch (type) {
    case "secondary": {
      return "text-hkGray";
    }
    case "success": {
      return "text-green-500";
    }
    case "warning": {
      return "text-orange-500";
    }
    case "error": {
      return "text-red-500";
    }
    default: {
      return "";
    }
  }
};

export const Text = ({ children, size, spaceAfter, type }: TextProps) => {
  const computedClasses = useMemo(() => {
    const sizeClasses = getSizeClasses(size);
    const spaceAfterClasses = getSpaceAfterClasses(spaceAfter);
    const typeClasses = getTypeClasses(type);

    return [sizeClasses, spaceAfterClasses, typeClasses].join(" ");
  }, [size, spaceAfter, type]);

  return <p className={computedClasses}>{children}</p>;
};
