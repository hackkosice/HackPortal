import React from "react";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

type StepProps = {
  title: string;
  stepNumber: number;
  onEdit: () => void;
  onDelete: () => void;
};

const Step = ({ title, stepNumber, onEdit, onDelete }: StepProps) => {
  return (
    <div className="border-2 border-hkOrange p-4 mb-1 rounded-md">
      <Stack alignItems="center">
        <Text>{stepNumber}.</Text>
        <Text>{title}</Text>
        <div className="flex-grow" />
        <Button
          label=""
          size="small"
          icon={
            <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          }
          colorType="tertiary"
          onClick={onEdit}
        />
        <Button
          label=""
          size="small"
          icon={<TrashIcon className="w-4 h-4 mr-1 text-hkOrange inline" />}
          colorType="tertiary"
          onClick={onDelete}
        />
      </Stack>
    </div>
  );
};

export default Step;
