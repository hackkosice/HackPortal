import React, { PropsWithChildren, useMemo } from "react";
import { Size } from "@/components/types";

export type CardProps = PropsWithChildren<{
  padding?: Size;
}>;

const CARD_BASE_CLASSES = "bg-hkGray rounded-lg p-10";

const getPaddingClasses = (padding: Size | undefined) => {
  switch (padding) {
    case "small": {
      return "p-5";
    }
    case "large": {
      return "p-20";
    }
    default: {
      return "p-10";
    }
  }
};

export const Card = ({ children, padding }: CardProps) => {
  const computedClasses = useMemo(() => {
    return getPaddingClasses(padding);
  }, [padding]);

  return (
    <div className={`${CARD_BASE_CLASSES} ${computedClasses}`}>{children}</div>
  );
};
