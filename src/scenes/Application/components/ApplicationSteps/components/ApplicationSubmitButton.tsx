"use client";

import React, { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import submitApplication from "@/server/actions/submitApplication";

type ApplicationSubmitButtonProps = { canSubmit: boolean };
const ApplicationSubmitButton = ({
  canSubmit,
}: ApplicationSubmitButtonProps) => {
  const [submitConfirmationModalOpened, setSubmitConfirmationModalOpened] =
    useState(false);
  const onSubmitConfirmationClose = async (value: boolean) => {
    if (value) {
      await submitApplication();
    }
    setSubmitConfirmationModalOpened(false);
  };
  return (
    <>
      <ConfirmationModal
        question={
          "Are you sure you want to submit your application? After submitting the application will be locked for changes. You can still join, create and manage your team."
        }
        isOpened={submitConfirmationModalOpened}
        onClose={onSubmitConfirmationClose}
      />
      <Button
        disabled={!canSubmit}
        onClick={() => setSubmitConfirmationModalOpened(true)}
      >
        Submit application
      </Button>
    </>
  );
};

export default ApplicationSubmitButton;
