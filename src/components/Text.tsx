import React, { PropsWithChildren } from "react";
import { Size } from "@/components/types";

export type TextProps = PropsWithChildren<{
  size?: Size;
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

export const Text = ({ children, size }: TextProps) => {
  return <p className={getSizeClasses(size)}>{children}</p>;
};
