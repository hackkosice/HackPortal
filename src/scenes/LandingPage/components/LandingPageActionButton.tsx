"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useLog, { LogAction } from "@/services/hooks/useLog";

type LandingPageActionButtonProps = {
  content: string;
};
const LandingPageActionButton = ({ content }: LandingPageActionButtonProps) => {
  const { log } = useLog();
  return (
    <Button asChild>
      <Link
        href="/application"
        onClick={() => {
          log({
            action: LogAction.ButtonClicked,
            detail: "Landing page action button",
            data: {
              content,
            },
          });
        }}
      >
        {content}
      </Link>
    </Button>
  );
};

export default LandingPageActionButton;
