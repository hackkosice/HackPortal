import React, { ReactNode } from "react";
import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/components/lib/utils";

type TooltipProps = {
  trigger: ReactNode;
  content: ReactNode;
  delayDuration?: number;
  className?: string;
};
const Tooltip = ({
  trigger,
  content,
  className,
  delayDuration = 400,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipBase onOpenChange={setIsOpen} open={isOpen}>
        <TooltipTrigger asChild onClick={() => setIsOpen((val) => !val)}>
          {trigger}
        </TooltipTrigger>
        <TooltipContent className={cn("max-w-[300px]", className)}>
          {content}
        </TooltipContent>
      </TooltipBase>
    </TooltipProvider>
  );
};

export default Tooltip;
