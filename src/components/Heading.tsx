import React, { PropsWithChildren, useMemo } from "react";
import { Size, Spacing } from "@/components/types";

export type HeadingProps = PropsWithChildren<{
  size?: Size;
  spaceAfter?: Spacing;
  centered?: boolean;
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

const getCenteredClasses = (centered: boolean) => {
  if (centered) {
    return "text-center";
  }
  return "";
};

const BASE_HEADING_CLASSES = "font-title font-bold text-primaryTitle";

export const Heading = ({
  children,
  size,
  spaceAfter,
  centered = false,
}: HeadingProps) => {
  const computedClasses = useMemo(() => {
    return [
      getSizeClasses(size),
      getSpaceAfterClasses(spaceAfter),
      getCenteredClasses(centered),
    ].join(" ");
  }, [size, spaceAfter, centered]);
  return (
    <h1 className={`${BASE_HEADING_CLASSES} ${computedClasses}`}>{children}</h1>
  );
};
