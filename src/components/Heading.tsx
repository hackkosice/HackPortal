import React, { PropsWithChildren, useMemo } from "react";
import { Size } from "@/components/types";

export type HeadingProps = PropsWithChildren<{
  size?: Size;
}>;

const getSizeClasses = (size: Size | undefined) => {
  switch (size) {
    case "small": {
      return "text-lg md:text-2xl";
    }
    case "large": {
      return "text-6xl";
    }
    default: {
      return "text-4xl";
    }
  }
};

const BASE_HEADING_CLASSES = "font-title font-bold text-hkPurple";

export const Heading = ({ children, size }: HeadingProps) => {
  const computedClasses = useMemo(() => {
    return getSizeClasses(size);
  }, [size]);
  return (
    <h1 className={`${BASE_HEADING_CLASSES} ${computedClasses}`}>{children}</h1>
  );
};
