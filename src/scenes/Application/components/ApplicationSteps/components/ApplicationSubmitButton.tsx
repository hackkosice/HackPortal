"use client";

import React, { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { trpc } from "@/services/trpc";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type ApplicationSubmitButtonProps = { canSubmit: boolean };
const ApplicationSubmitButton = ({
  canSubmit,
}: ApplicationSubmitButtonProps) => {
  const { refresh } = useRouter();
  const { mutateAsync: submitApplication } = trpc.submitApplication.useMutation(
    {
      onSuccess: () => {
        refresh();
      },
    }
  );
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
        label="Submit application"
        disabled={!canSubmit}
        onClick={() => setSubmitConfirmationModalOpened(true)}
      />
    </>
  );
};

export default ApplicationSubmitButton;
