import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import { trpc } from "@/services/trpc";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import EditTitleModal from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/components/EditTitleModal";
import StepFormField from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/components/StepFormField";
import { Stack } from "@/components/Stack";
import { useForm } from "react-hook-form";
import { InputText } from "@/components/InputText";
import { InputSelect } from "@/components/InputSelect";

export type Props = {
  stepId: number;
};

type NewFieldForm = {
  label: string;
  typeId: string;
};

const EditStepForm = ({ stepId }: Props) => {
  const { data } = trpc.stepInfo.useQuery({ id: stepId });
  const { data: dataFieldTypes } = trpc.formFieldTypes.useQuery();
  const { mutateAsync: newFormField } = trpc.newFormField.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
  });

  const utils = trpc.useContext();
  const { mutateAsync: editStep } = trpc.editStep.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
  });

  const [isEditTileModalOpened, setIsEditTileModalOpened] = useState(false);

  const onEditTitleModalSave = async (title: string) => {
    await editStep({ id: stepId, title });
    setIsEditTileModalOpened(false);
  };

  const { register, handleSubmit, reset } = useForm<NewFieldForm>();

  const onNewFieldSubmit = async ({ label, typeId }: NewFieldForm) => {
    await newFormField({
      label,
      stepId,
      name: label,
      typeId: Number(typeId),
      required: true,
    });
    reset();
  };

  return (
    <>
      <EditTitleModal
        isOpened={isEditTileModalOpened}
        onClose={() => setIsEditTileModalOpened(false)}
        onSave={onEditTitleModalSave}
        initialValue={data?.data.title}
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
        <Stack direction="column" spacing="small">
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
        <Heading size="small" spaceAfter="medium">
          Create new field
        </Heading>
        <form onSubmit={handleSubmit(onNewFieldSubmit)}>
          <Stack direction="column">
            <InputText
              label="Label"
              register={register}
              required
              name="label"
            />
            {dataFieldTypes && (
              <InputSelect
                label="Field type"
                options={dataFieldTypes.data.map((fieldType) => ({
                  value: String(fieldType.id),
                  label: fieldType.value,
                }))}
                register={register}
                required
                name="typeId"
              />
            )}
            <Button label="Add new field" spaceAfter="large" type="submit" />
          </Stack>
        </form>
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
