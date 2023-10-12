"use client";

import React from "react";
import { Button } from "@/components/Button";
import { signOut } from "next-auth/react";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";

const SignoutButton = () => {
  const onSignOutClick = () => {
    clearLocalApplicationData();
    signOut({ callbackUrl: "/signin" });
  };
  return <Button label="Sign out" size="small" onClick={onSignOutClick} />;
};

export default SignoutButton;
