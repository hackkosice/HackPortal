import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/lib/utils";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    spacing: {
      none: "",
      small: "gap-2",
      medium: "gap-4",
      large: "gap-6",
    },
    alignItems: {
      center: "items-center",
      start: "items-start",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      center: "justify-center",
      start: "justify-start",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    spaceAfter: {
      small: "mb-1",
      medium: "mb-3",
      large: "mb-5",
    },
  },
  defaultVariants: {
    direction: "row",
    spacing: "medium",
    alignItems: "start",
    spaceAfter: undefined,
    justify: "start",
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction,
      spacing,
      alignItems,
      justify,
      spaceAfter,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          stackVariants({
            direction,
            spacing,
            alignItems,
            justify,
            spaceAfter,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

export { Stack, stackVariants };
