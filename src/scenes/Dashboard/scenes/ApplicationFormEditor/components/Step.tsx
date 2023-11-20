import React, { useState } from "react";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import deleteStep from "@/server/actions/dashboard/applicationFormEditor/deleteStep";
import { useParams } from "next/navigation";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import moveStep from "@/server/actions/dashboard/applicationFormEditor/moveStep";
import callServerAction from "@/services/helpers/server/callServerAction";
import { useToast } from "@/components/ui/use-toast";

type StepProps = {
  stepId: number;
  title: string;
  position: number;
};

const Step = ({ title, position, stepId }: StepProps) => {
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const params = useParams();
  const { toast } = useToast();
  const onStepDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await callServerAction(deleteStep, { stepId, force: false });
    if (!res.success) {
      if (res.message === "This step has some form fields and force is false") {
        setIsConfirmationModalOpened(true);
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: res.message,
      });
    }
  };

  const onMoveUpClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await moveStep({
      stepId,
      direction: "up",
    });
  };

  const onMoveDownClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await moveStep({
      stepId,
      direction: "down",
    });
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
            <Stack direction="column" spacing="none">
              <Button
                variant="unstyled"
                size="smallest"
                className="text-hkOrange hover:bg-slate-200"
                onClick={onMoveUpClick}
                aria-label={`Move step ${title} up`}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="unstyled"
                size="smallest"
                className="text-hkOrange hover:bg-slate-200"
                onClick={onMoveDownClick}
                aria-label={`Move step ${title} down`}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </Stack>
            <Button
              size="icon"
              variant="ghost"
              onClick={onStepDelete}
              aria-label={`Delete step ${title}`}
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
