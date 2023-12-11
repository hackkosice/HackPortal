"use client";

import React from "react";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import resendVerificationLink from "@/server/actions/auth/resendVerificationLink";
import { Card } from "@/components/ui/card";
import callServerAction from "@/services/helpers/server/callServerAction";

const UnverifiedEmailAlert = () => {
  const { toast } = useToast();
  const onResendEmailClick = async () => {
    const res = await callServerAction(resendVerificationLink, undefined);
    if (!res.success) {
      toast({
        title: "Error sending email",
        description: res.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Email sent!",
      description: "We've sent you an email with verification link.",
    });
  };
  return (
    <Card className="p-5 w-[95vw] md:w-[50vw] md:mx-auto mb-5 bg-red-600">
      <Stack
        justify="center"
        alignItems="center"
        direction="column"
        className="gap-2"
      >
        <Text className="font-title font-semibold text-xl md:text-2xl text-white">
          You have unverified email!
        </Text>
        <Text className="text-white text-sm md:text-base">
          Please check link in your email to verify your email address. Without
          verifying your email address you won&apos;t be able to submit your
          application.
        </Text>
        <Text className="text-white text-sm">
          Didn&apos;t receive any email?
        </Text>
        <Button
          variant="link"
          className="text-white"
          onClick={onResendEmailClick}
        >
          Resend email with verification link
        </Button>
      </Stack>
    </Card>
  );
};

export default UnverifiedEmailAlert;
