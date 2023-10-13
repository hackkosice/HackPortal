import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { trpc } from "@/services/trpc";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import EditTitleModal from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleModal";
import StepFormField from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/Stack";
import NewFieldModal from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/components/NewFieldModal";
import Link from "next/link";

export type Props = {
  stepId: number;
};

const FormStepEditor = ({ stepId }: Props) => {
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
        <CardHeader>
          <CardTitle>{data?.data.title}</CardTitle>
          <Button
            variant="outline"
            size="small"
            onClick={() => setIsEditTileModalOpened(true)}
          >
            <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
            Edit title
          </Button>
        </CardHeader>
        <CardContent>
          <Heading size="small" spaceAfter="medium">
            Form fields
          </Heading>
          <Stack direction="column" spacing="small" spaceAfter="medium">
            {data?.data.formFields.map(
              ({ id, label, position, type: { value }, required }) => (
                <StepFormField
                  key={id}
                  formFieldId={id}
                  label={label}
                  type={value}
                  position={position}
                  required={required}
                />
              )
            )}
          </Stack>
        </CardContent>
        <CardFooter>
          <Stack direction="column">
            <Button onClick={() => setIsNewFieldModalOpened(true)}>
              Create new field
            </Button>
            <Button asChild variant="outline" size="small">
              <Link href="/dashboard/form-editor">Back to steps</Link>
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    </>
  );
};

export default FormStepEditor;
