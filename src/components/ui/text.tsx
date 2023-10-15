import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/components/lib/utils";

const textVariants = cva("font-default", {
  variants: {
    size: {
      small: "text-sm",
      large: "text-lg",
      medium: "text-base",
    },
    spaceAfter: {
      small: "mb-1",
      medium: "mb-3",
      large: "mb-5",
    },
    type: {
      secondary: "text-hkGray",
      success: "text-green-500",
      warning: "text-orange-500",
      error: "text-red-500",
    },
    weight: {
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "medium",
    spaceAfter: undefined,
    type: undefined,
    weight: undefined,
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size, weight, type, spaceAfter, ...props }, ref) => {
    return (
      <p
        className={cn(
          textVariants({
            size,
            weight,
            type,
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
Text.displayName = "Text";

export { Text, textVariants };
