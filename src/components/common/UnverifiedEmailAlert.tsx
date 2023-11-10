"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import resendVerificationLink from "@/server/actions/auth/resendVerificationLink";

const UnverifiedEmailAlert = () => {
  const { toast } = useToast();
  const onResendEmailClick = async () => {
    await resendVerificationLink();
    toast({
      title: "Email sent!",
      description: "We've sent you an email with verification link.",
    });
  };
  return (
    <Alert variant="destructive">
      <AlertTitle>You have unverified email!</AlertTitle>
      <AlertDescription>
        <Text size="small">
          Please check link in your email to verify your email address.
        </Text>
        <Stack direction="row" alignItems="center" spacing="small">
          <Text size="small">Didn&apos;t receive any email?</Text>
          <Button variant="link" onClick={onResendEmailClick}>
            Resend email with verification link
          </Button>
        </Stack>
      </AlertDescription>
    </Alert>
  );
};

export default UnverifiedEmailAlert;
