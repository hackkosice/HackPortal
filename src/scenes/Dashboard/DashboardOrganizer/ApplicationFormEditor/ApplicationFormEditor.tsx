import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/Button";
import Step from "./components/Step";
import { Modal } from "@/components/Modal";
import { InputText } from "@/components/InputText";
import { Stack } from "@/components/Stack";
import { useForm } from "react-hook-form";

type TitleEditForm = {
  title: string;
};

const ApplicationFormEditor = () => {
  const [isEditTitleModalOpened, setIsEditTitleModalOpened] = useState(false);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const { register: registerTitleEdit, handleSubmit } =
    useForm<TitleEditForm>();

  const { data, isLoading } = trpc.steps.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: newStep } = trpc.newStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });
  const { mutateAsync: editStep } = trpc.editStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });
  const { mutateAsync: deleteStep } = trpc.deleteStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });

  const createNewStep = () => {
    newStep();
  };

  const onStepEdit = async (stepId: number) => {
    setIsEditTitleModalOpened(true);
    setEditingStepId(stepId);
  };

  const onEditTitleModalSave = async (data: TitleEditForm) => {
    setIsEditTitleModalOpened(false);
    editStep({ id: editingStepId as number, title: data.title });
    setEditingStepId(null);
  };

  const onEditTitleModalClose = async () => {
    setIsEditTitleModalOpened(false);
    setEditingStepId(null);
  };

  const onStepDelete = async (stepId: number) => {
    deleteStep({ id: stepId });
  };

  return (
    <>
      <Modal
        isOpened={isEditTitleModalOpened}
        closeOnOutsideClick={true}
        onClose={onEditTitleModalClose}
      >
        <form onSubmit={handleSubmit(onEditTitleModalSave)}>
          <Stack direction="column">
            <InputText
              label="New title"
              register={registerTitleEdit}
              name="title"
              required
            />
            <Button type="submit" label={"Save"} />
          </Stack>
        </form>
      </Modal>
      <Card>
        <Heading centered spaceAfter="medium">
          Application Form Editor
        </Heading>
        {isLoading && <Text>Loading...</Text>}
        {data?.data.map(({ title, id, stepNumber }) => (
          <Step
            key={id}
            title={title}
            stepNumber={stepNumber}
            onEdit={() => onStepEdit(id)}
            onDelete={() => onStepDelete(id)}
          />
        ))}
        <br />
        <Button label="Create new step" onClick={createNewStep} />
      </Card>
    </>
  );
};

export default ApplicationFormEditor;
