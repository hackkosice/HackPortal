"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";

const SignoutButton = () => {
  const onSignOutClick = () => {
    clearLocalApplicationData();
    signOut({ callbackUrl: "/signin" });
  };
  return (
    <Button size="small" onClick={onSignOutClick}>
      Sign out
    </Button>
  );
};

export default SignoutButton;
