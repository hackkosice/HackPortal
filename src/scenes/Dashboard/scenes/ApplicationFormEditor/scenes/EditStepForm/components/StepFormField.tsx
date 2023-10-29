"use client";

import React, { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import deleteFormField from "@/server/actions/dashboard/deleteFormField";
import NewFieldDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import { FormFieldTypesData } from "@/server/getters/dashboard/formFieldTypes";
import { OptionListsData } from "@/server/getters/dashboard/optionListManager/getOptionLists";
import { FormFieldData } from "@/server/getters/dashboard/stepInfo";

export type Props = {
  formField: FormFieldData;
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
};

const StepFormField = ({
  formField: {
    id: fieldId,
    label,
    name,
    type,
    required,
    position,
    optionListId,
  },
  formFieldTypes,
  optionLists,
}: Props) => {
  const [isConfirmationModalOpened, setIsConfirmationModalOpened] =
    useState(false);
  const onFormFieldDelete = async () => {
    try {
      await deleteFormField({ fieldId, force: false });
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "This form field has some values and force is false"
      ) {
        setIsConfirmationModalOpened(true);
      } else {
        throw err;
      }
    }
  };

  const onConfirmClose = async (value: boolean) => {
    if (value) {
      await deleteFormField({ fieldId, force: true });
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
      <Stack direction="row" alignItems="center" spacing="small">
        <Text>
          {position}. {label} ({type})
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
        <NewFieldDialog
          formFieldId={fieldId}
          formFieldTypes={formFieldTypes}
          optionLists={optionLists}
          mode="edit"
          initialData={{
            label,
            typeId: formFieldTypes
              .find((fieldType) => fieldType.value === type)
              ?.id.toString() as string,
            required,
            optionListId: optionListId ? optionListId.toString() : undefined,
          }}
          name={name}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={onFormFieldDelete}
          aria-label={`Delete field ${name}`}
        >
          <TrashIcon className="w-4 h-4 text-hkOrange" />
        </Button>
      </Stack>
    </>
  );
};

export default StepFormField;
