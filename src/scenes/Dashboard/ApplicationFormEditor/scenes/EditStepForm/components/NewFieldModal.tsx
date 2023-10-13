import React, { useEffect } from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import { Modal } from "@/components/Modal";
import { Heading } from "@/components/Heading";
import { InputCheckbox } from "@/components/InputCheckbox";

export type Props = {
  stepId: number;
  isOpened: boolean;
  onClose: () => void;
};

type NewFieldForm = {
  label: string;
  typeId: string;
  required: boolean;
};

const NewFieldModal = ({ stepId, onClose, isOpened }: Props) => {
  const utils = trpc.useContext();
  const { data: dataFieldTypes } = trpc.formFieldTypes.useQuery();
  const { register, handleSubmit, reset } = useForm<NewFieldForm>();
  const { mutateAsync: newFormField } = trpc.newFormField.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
  });

  const onNewFieldSubmit = async ({
    label,
    typeId,
    required,
  }: NewFieldForm) => {
    await newFormField({
      label,
      stepId,
      name: label,
      typeId: Number(typeId),
      required,
    });
    onClose();
  };

  useEffect(() => {
    reset();
  }, [isOpened, reset]);

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
      <Heading spaceAfter="medium" size="small">
        Add new field
      </Heading>
      <form onSubmit={handleSubmit(onNewFieldSubmit)}>
        <Stack direction="column">
          <InputText label="Label" register={register} required name="label" />
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
          <InputCheckbox
            label="Required field"
            name="required"
            register={register}
          />
          <Button asChild>
            <input type="submit" value="Add new field" />
          </Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default NewFieldModal;
