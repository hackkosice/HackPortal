import React from "react";
import { Text } from "@/components/Text";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/Button";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

type StepProps = {
  title: string;
  stepNumber: number;
  onEdit: () => void;
};

const Step = ({ title, stepNumber, onEdit }: StepProps) => {
  return (
    <div className="border-2 border-hkOrange p-4 mb-1">
      <Stack alignItems="center">
        <Text>{stepNumber}.</Text>
        <Text>{title}</Text>
        <Button
          label="Edit title"
          size="small"
          icon={
            <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          }
          colorType="tertiary"
          onClick={onEdit}
        />
      </Stack>
    </div>
  );
};

export default Step;
