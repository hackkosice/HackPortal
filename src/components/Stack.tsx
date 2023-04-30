import React, { PropsWithChildren, useMemo } from "react";
import { Direction, Size } from "@/components/types";

export type StackProps = PropsWithChildren<{
  spacing?: Size;
  direction?: Direction;
  alignItems?: "center" | "start" | "end" | "baseline" | "stretch";
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

const getAlignItemsClasses = (alignItems?: string) => {
  switch (alignItems) {
    case "center":
      return "items-center";
    case "end":
      return "items-end";
    case "baseline":
      return "items-baseline";
    case "stretch":
      return "items-stretch";
    default:
      return "items-start";
  }
};

const STACK_BASE_CLASSES = "flex";

export const Stack = ({
  children,
  direction,
  spacing,
  alignItems = "start",
}: StackProps) => {
  const computedClasses = useMemo(() => {
    const directionClasses = getDirectionClasses(direction);
    const spacingClasses = getSpacingClasses(spacing);
    const alignContentClasses = getAlignItemsClasses(alignItems);

    return [directionClasses, spacingClasses, alignContentClasses].join(" ");
  }, [direction, spacing, alignItems]);
  return (
    <div className={`${STACK_BASE_CLASSES} ${computedClasses}`}>{children}</div>
  );
};
