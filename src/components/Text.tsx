import React, { PropsWithChildren, useMemo } from "react";
import { Size, Spacing } from "@/components/types";

export type TextProps = PropsWithChildren<{
  size?: Size;
  spaceAfter?: Spacing;
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

export const Text = ({ children, size, spaceAfter }: TextProps) => {
  const computedClasses = useMemo(() => {
    const sizeClasses = getSizeClasses(size);
    const spaceAfterClasses = getSpaceAfterClasses(spaceAfter);

    return [sizeClasses, spaceAfterClasses].join(" ");
  }, [size, spaceAfter]);

  return <p className={computedClasses}>{children}</p>;
};
