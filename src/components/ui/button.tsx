import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/components/lib/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "whitespace-nowrap overflow-hidden cursor-pointer inline-flex items-center justify-center rounded-md text-md font-default ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2",
        small: "h-9 rounded-md px-3",
        large: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        smallest: "p-0",
      },
      variant: {
        default:
          "bg-primaryButton text-slate-50 hover:bg-primaryButton/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border-2 text-hkOrange border-primaryButton bg-white hover:bg-slate-50/90 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "text-hkOrange hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        unstyled: "",
        link: "text-hkOrange underline-offset-4 hover:underline dark:text-slate-50 p-0 m-0 h-fit w-fit",
        combobox:
          "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-hkOrange disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
