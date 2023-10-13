"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { InputSelect } from "@/components/InputSelect";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import { InputCheckbox } from "@/components/InputCheckbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type Props = {
  stepId: number;
};

type NewFieldForm = {
  label: string;
  typeId: string;
  required: boolean;
};

const NewFieldDialog = ({ stepId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
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
    setIsOpened(false);
  };

  useEffect(() => {
    reset();
  }, [isOpened, reset]);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button>Create new field</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new field</DialogTitle>
        </DialogHeader>
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
            <InputCheckbox
              label="Required field"
              name="required"
              register={register}
            />
            <DialogFooter>
              <Button asChild>
                <input type="submit" value="Add new field" />
              </Button>
            </DialogFooter>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFieldDialog;
