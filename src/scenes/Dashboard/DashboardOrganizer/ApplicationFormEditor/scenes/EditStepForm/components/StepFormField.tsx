import React from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";

export type Props = {
  label: string;
  type: string;
  formFieldNumber: number;
};

const StepFormField = ({ label, type, formFieldNumber }: Props) => {
  const onFormFieldDelete = () => {
    console.log("DELETE FORM FIELD");
  };
  return (
    <Stack direction="row" alignItems="center">
      <Text>
        {formFieldNumber}. {label} ({type})
      </Text>
      <Button
        label=""
        size="small"
        icon={<TrashIcon className="w-4 h-4 mr-1 text-hkOrange inline" />}
        colorType="tertiary"
        onClick={onFormFieldDelete}
      />
    </Stack>
  );
};

export default StepFormField;
