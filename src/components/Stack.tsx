import React, { PropsWithChildren, useMemo } from "react";
import { Direction, Size } from "@/components/types";

export type StackProps = PropsWithChildren<{
  spacing?: Size;
  direction?: Direction;
}>;

const getDirectionClasses = (direction?: Direction) => {
  switch (direction) {
    case "column":
      return "flex-col";
    default:
      return "flex-row";
  }
};

const getSpacingClasses = (spacing?: Size) => {
  switch (spacing) {
    case "small":
      return "gap-2";
    case "large":
      return "gap-7";
    default:
      return "gap-4";
  }
};

const STACK_BASE_CLASSES = "flex";

export const Stack = ({ children, direction, spacing }: StackProps) => {
  const computedClasses = useMemo(() => {
    const directionClasses = getDirectionClasses(direction);
    const spacingClasses = getSpacingClasses(spacing);

    return [directionClasses, spacingClasses].join(" ");
  }, [direction, spacing]);
  return (
    <div className={`${STACK_BASE_CLASSES} ${computedClasses}`}>{children}</div>
  );
};
