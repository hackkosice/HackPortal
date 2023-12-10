"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import useLog, { LogAction } from "@/services/hooks/useLog";

const SignoutButton = () => {
  const { log } = useLog();
  const onSignOutClick = () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Sign out",
    });
    signOut({ callbackUrl: "/signin" });
  };
  return (
    <Button size="small" onClick={onSignOutClick}>
      Sign out
    </Button>
  );
};

export default SignoutButton;
