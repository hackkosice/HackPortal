"use client";

import React from "react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import submitApplication from "@/server/actions/submitApplication";

type ApplicationSubmitButtonProps = { canSubmit: boolean };
const ApplicationSubmitButton = ({
  canSubmit,
}: ApplicationSubmitButtonProps) => {
  const onSubmitConfirmationClose = async (value: boolean) => {
    if (value) {
      await submitApplication();
    }
  };
  return (
    <ConfirmationDialog
      question={
        "Are you sure you want to submit your application? After submitting the application will be locked for changes. You can still join, create and manage your team."
      }
      onAnswer={onSubmitConfirmationClose}
    >
      <Button disabled={!canSubmit}>Submit application</Button>
    </ConfirmationDialog>
  );
};

export default ApplicationSubmitButton;
