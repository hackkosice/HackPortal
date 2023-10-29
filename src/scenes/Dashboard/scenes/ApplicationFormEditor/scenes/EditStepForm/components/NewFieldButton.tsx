"use client";

import React, { useState } from "react";
import NewFieldDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import { FormFieldTypesData } from "@/server/getters/dashboard/formFieldTypes";
import { OptionListsData } from "@/server/getters/dashboard/optionListManager/getOptionLists";
import { Button } from "@/components/ui/button";

type NewFieldButtonProps = {
  stepId: number;
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
};
const NewFieldButton = ({
  stepId,
  formFieldTypes,
  optionLists,
}: NewFieldButtonProps) => {
  const [isNewFieldDialogOpened, setIsNewFieldDialogOpened] = useState(false);
  return (
    <>
      <NewFieldDialog
        stepId={stepId}
        formFieldTypes={formFieldTypes}
        optionLists={optionLists}
        isOpened={isNewFieldDialogOpened}
        onOpenChange={setIsNewFieldDialogOpened}
      />
      <Button onClick={() => setIsNewFieldDialogOpened(true)}>
        Create new field
      </Button>
    </>
  );
};

export default NewFieldButton;
