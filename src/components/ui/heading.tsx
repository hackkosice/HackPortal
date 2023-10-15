import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/components/lib/utils";

const headingVariants = cva("font-title font-bold text-primaryTitle", {
  variants: {
    size: {
      small: "text-lg md:text-2xl",
      large: "text-6xl",
      medium: "text-4xl",
    },
    spaceAfter: {
      small: "mb-1",
      medium: "mb-3",
      large: "mb-5",
    },
    centered: {
      true: "text-center",
    },
  },
  defaultVariants: {
    size: "medium",
    spaceAfter: undefined,
    centered: false,
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, centered, spaceAfter, ...props }, ref) => {
    return (
      <h1
        className={cn(
          headingVariants({
            size,
            centered,
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
Heading.displayName = "Heading";

export { Heading, headingVariants };
