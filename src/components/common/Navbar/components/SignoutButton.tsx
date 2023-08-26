"use client";

import React from "react";
import { Button } from "@/components/Button";
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return <Button label="Sign out" size="small" onClick={signOut} />;
};

export default SignoutButton;
