import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { TRPCClientError } from "@trpc/client";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

export type Props = {
  label: string;
  type: string;
  position: number;
  formFieldId: number;
  required: boolean;
};

const StepFormField = ({
  label,
  type,
  position,
  formFieldId,
  required,
}: Props) => {
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const utils = trpc.useContext();
  const { mutateAsync } = trpc.deleteFormField.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const onFormFieldDelete = async () => {
    try {
      await mutateAsync({ id: formFieldId, force: false });
    } catch (err) {
      if (err instanceof TRPCClientError && err.data.code == "CONFLICT") {
        setIsConfirmationModalOpened(true);
      } else {
        throw err;
      }
    }
  };

  const onConfirmClose = async (value: boolean) => {
    if (value) {
      await mutateAsync({ id: formFieldId, force: true });
    }
    setIsConfirmationModalOpened(false);
  };

  return (
    <>
      <ConfirmationDialog
        question={
          "This field contains some already filled values. Deleting it will also delete those values. Do you want to proceed?"
        }
        isManuallyOpened={isConfirmationModalOpened}
        onAnswer={onConfirmClose}
      />
      <Stack direction="row" alignItems="center">
        <Text>
          {position}. {label} ({type})
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
        <Button
          size="icon"
          variant="ghost"
          onClick={onFormFieldDelete}
          aria-label={`Delete field ${position}`}
        >
          <TrashIcon className="w-4 h-4 text-hkOrange" />
        </Button>
      </Stack>
    </>
  );
};

export default StepFormField;
