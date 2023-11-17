"use client";

import React, { useState } from "react";
import NewFieldDialog from "@/scenes/Dashboard/scenes/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldDialog";
import { FormFieldTypesData } from "@/server/getters/dashboard/applicationFormEditor/formFieldTypes";
import { OptionListsData } from "@/server/getters/dashboard/optionListManager/getOptionLists";
import { Button } from "@/components/ui/button";
import { PotentialVisibilityRuleTargetsData } from "@/server/getters/dashboard/applicationFormEditor/potentialVisibilityRuleTargets";

type NewFieldButtonProps = {
  stepId: number;
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
  potentialVisibilityRuleTargets: PotentialVisibilityRuleTargetsData;
};
const NewFieldButton = ({
  stepId,
  formFieldTypes,
  optionLists,
  potentialVisibilityRuleTargets,
}: NewFieldButtonProps) => {
  const [isNewFieldDialogOpened, setIsNewFieldDialogOpened] = useState(false);
  return (
    <>
      <NewFieldDialog
        stepId={stepId}
        additionalData={{
          formFieldTypes,
          optionLists,
          potentialVisibilityRuleTargets,
        }}
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
