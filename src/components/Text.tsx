import React, { PropsWithChildren, useMemo } from "react";
import { ColorType, Size, Spacing, Weight } from "@/components/types";

export type TextProps = PropsWithChildren<{
  size?: Size;
  spaceAfter?: Spacing;
  type?: ColorType;
  weight?: Weight;
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

const getWeightClasses = (weight: Weight | undefined) => {
  switch (weight) {
    case "bold": {
      return "font-bold";
    }
    default: {
      return "";
    }
  }
};

export const Text = ({
  children,
  size,
  spaceAfter,
  type,
  weight,
}: TextProps) => {
  const computedClasses = useMemo(() => {
    const sizeClasses = getSizeClasses(size);
    const spaceAfterClasses = getSpaceAfterClasses(spaceAfter);
    const typeClasses = getTypeClasses(type);
    const weightClasses = getWeightClasses(weight);

    return [sizeClasses, spaceAfterClasses, typeClasses, weightClasses].join(
      " "
    );
  }, [size, spaceAfter, type, weight]);

  return <p className={computedClasses}>{children}</p>;
};
