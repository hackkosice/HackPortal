import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import { trpc } from "@/services/trpc";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import EditTitleModal from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleModal";
import StepFormField from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/Stack";
import NewFieldModal from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldModal";

export type Props = {
  stepId: number;
};

const EditStepForm = ({ stepId }: Props) => {
  const { data } = trpc.stepInfo.useQuery({ id: stepId });

  const [isEditTileModalOpened, setIsEditTileModalOpened] = useState(false);
  const [isNewFieldModalOpened, setIsNewFieldModalOpened] = useState(false);

  return (
    <>
      <EditTitleModal
        isOpened={isEditTileModalOpened}
        onClose={() => setIsEditTileModalOpened(false)}
        initialValue={data?.data.title}
        stepId={stepId}
      />
      <NewFieldModal
        stepId={stepId}
        onClose={() => setIsNewFieldModalOpened(false)}
        isOpened={isNewFieldModalOpened}
      />
      <Card>
        <Heading>{data?.data.title}</Heading>
        <Button
          label="Edit title"
          colorType="secondary"
          icon={
            <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          }
          size="small"
          onClick={() => setIsEditTileModalOpened(true)}
          spaceAfter="large"
        />
        <Heading size="small" spaceAfter="medium">
          Form fields
        </Heading>
        <Stack direction="column" spacing="small" spaceAfter="medium">
          {data?.data.formFields.map(
            ({ id, label, formFieldNumber, type: { value } }) => (
              <StepFormField
                key={id}
                label={label}
                type={value}
                formFieldNumber={formFieldNumber}
              />
            )
          )}
        </Stack>
        <Button
          label="Add new field"
          spaceAfter="large"
          onClick={() => setIsNewFieldModalOpened(true)}
        />
        <Button
          label="Back to dashboard"
          type="buttonLink"
          href="/dashboard/form-editor"
          colorType="secondary"
          size="small"
        />
      </Card>
    </>
  );
};

export default EditStepForm;
