import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { TRPCClientError } from "@trpc/client";
import ConfirmationModal from "@/components/common/ConfirmationModal";

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
      <ConfirmationModal
        question={
          "This field contains some already filled values. Deleting it will also delete those values. Do you want to proceed?"
        }
        isOpened={isConfirmationModalOpened}
        onClose={onConfirmClose}
      />
      <Stack direction="row" alignItems="center">
        <Text>
          {position}. {label} ({type})
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
        <Button
          label=""
          size="small"
          icon={<TrashIcon className="w-4 h-4 mr-1 text-hkOrange inline" />}
          colorType="tertiary"
          onClick={onFormFieldDelete}
        />
      </Stack>
    </>
  );
};

export default StepFormField;
