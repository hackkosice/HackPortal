import React, { useState } from "react";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { trpc } from "@/services/trpc";
import Link from "next/link";
import { TRPCClientError } from "@trpc/client";
import ConfirmationModal from "@/components/common/ConfirmationModal";

type StepProps = {
  stepId: number;
  title: string;
  position: number;
};

const Step = ({ title, position, stepId }: StepProps) => {
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const utils = trpc.useContext();
  const { mutateAsync: deleteStep } = trpc.deleteStep.useMutation({
    onSuccess: async () => {
      utils.steps.invalidate();
    },
  });
  const onStepDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteStep({ id: stepId, force: false });
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
      await deleteStep({ id: stepId, force: true });
    }
    setIsConfirmationModalOpened(false);
  };

  return (
    <>
      <ConfirmationModal
        question={
          "This step contains fields, which have some already filled values. Deleting it will also delete all the fields and their values. Do you want to proceed?"
        }
        isOpened={isConfirmationModalOpened}
        onClose={onConfirmClose}
      />
      <Link
        href={`/dashboard/form-editor/step/${stepId}/edit`}
        className="w-full"
      >
        <div className="border-2 border-hkOrange p-4 rounded-md">
          <Stack alignItems="center">
            <Text>{position}.</Text>
            <Text>{title}</Text>
            <div className="flex-grow" />
            <Button
              label=""
              size="small"
              icon={<TrashIcon className="w-4 h-4 mr-1 text-hkOrange inline" />}
              colorType="tertiary"
              onClick={onStepDelete}
            />
          </Stack>
        </div>
      </Link>
    </>
  );
};

export default Step;
