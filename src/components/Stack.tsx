import React, { PropsWithChildren, useMemo } from "react";
import { Direction, Size, Spacing } from "@/components/types";

export type StackProps = PropsWithChildren<{
  spacing?: Size;
  direction?: Direction;
  alignItems?: "center" | "start" | "end" | "baseline" | "stretch";
  spaceAfter?: Size;
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

const STACK_BASE_CLASSES = "flex w-full";

export const Stack = ({
  children,
  direction,
  spacing,
  alignItems = "start",
  spaceAfter,
}: StackProps) => {
  const computedClasses = useMemo(() => {
    const directionClasses = getDirectionClasses(direction);
    const spacingClasses = getSpacingClasses(spacing);
    const alignContentClasses = getAlignItemsClasses(alignItems);
    const spaceAfterClasses = getSpaceAfterClasses(spaceAfter);

    return [
      directionClasses,
      spacingClasses,
      alignContentClasses,
      spaceAfterClasses,
    ].join(" ");
  }, [direction, spacing, alignItems, spaceAfter]);
  return (
    <div className={`${STACK_BASE_CLASSES} ${computedClasses}`}>{children}</div>
  );
};
