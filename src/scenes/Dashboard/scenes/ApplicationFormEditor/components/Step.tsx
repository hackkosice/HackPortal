import React, { useState } from "react";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import deleteStep from "@/server/actions/dashboard/deleteStep";
import { useParams } from "next/navigation";

type StepProps = {
  stepId: number;
  title: string;
  position: number;
};

const Step = ({ title, position, stepId }: StepProps) => {
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const params = useParams();
  const onStepDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteStep({ stepId, force: false });
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message === "This step has some form fields and force is false"
        ) {
          setIsConfirmationModalOpened(true);
          return;
        }
      }
      throw err;
    }
  };

  const onConfirmClose = async (value: boolean) => {
    if (value) {
      await deleteStep({ stepId, force: true });
    }
    setIsConfirmationModalOpened(false);
  };

  return (
    <>
      <ConfirmationDialog
        question={
          "This step contains fields, which may have some already filled values. Deleting it will also delete all the fields and their values. Do you want to proceed?"
        }
        onAnswer={onConfirmClose}
        isManuallyOpened={isConfirmationModalOpened}
      />
      <Link
        href={`/dashboard/${params.hackathonId}/form-editor/step/${stepId}/edit`}
        className="w-full md:w-[400px]"
      >
        <div className="border-2 border-hkOrange p-4 rounded-md">
          <Stack alignItems="center">
            <Text>{position}.</Text>
            <Text>{title}</Text>
            <div className="flex-grow" />
            <Button
              size="icon"
              variant="ghost"
              onClick={onStepDelete}
              aria-label={`Delete step ${position}`}
            >
              <TrashIcon className="w-4 h-4 text-hkOrange" />
            </Button>
          </Stack>
        </div>
      </Link>
    </>
  );
};

export default Step;
