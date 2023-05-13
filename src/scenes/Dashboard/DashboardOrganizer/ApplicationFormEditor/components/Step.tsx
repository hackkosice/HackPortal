import React from "react";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { TrashIcon } from "@heroicons/react/24/solid";
import { trpc } from "@/services/trpc";
import Link from "next/link";

type StepProps = {
  stepId: number;
  title: string;
  stepNumber: number;
};

const Step = ({ title, stepNumber, stepId }: StepProps) => {
  const utils = trpc.useContext();
  const { mutateAsync: deleteStep } = trpc.deleteStep.useMutation({
    onSuccess: async () => {
      utils.steps.invalidate();
    },
  });
  const onStepDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteStep({ id: stepId });
  };

  return (
    <Link href={`/dashboard/form-editor/step/${stepId}/edit`}>
      <div className="border-2 border-hkOrange p-4 mb-1 rounded-md">
        <Stack alignItems="center">
          <Text>{stepNumber}.</Text>
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
  );
};

export default Step;
