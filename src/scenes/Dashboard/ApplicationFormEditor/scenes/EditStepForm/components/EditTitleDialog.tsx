"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

type TitleEditForm = {
  title: string;
};

export type Props = {
  stepId: number;
  initialValue?: string;
};

const EditTitleDialog = ({ initialValue, stepId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const utils = trpc.useContext();
  const { mutateAsync: editStep } = trpc.editStep.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
  });
  const {
    register: registerTitleEdit,
    handleSubmit,
    setValue: setTitleEditValue,
  } = useForm<TitleEditForm>();

  const onEditTitleModalSave = async ({ title }: TitleEditForm) => {
    await editStep({ id: stepId, title });
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) {
      setTitleEditValue("title", initialValue ?? "");
    }
  }, [initialValue, setTitleEditValue, isOpened]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button variant="outline" size="small">
          <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          Edit title
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit title of the step</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onEditTitleModalSave)}>
          <Stack direction="column">
            <InputText
              label="New title"
              register={registerTitleEdit}
              name="title"
              required
            />
          </Stack>
          <DialogFooter>
            <Button asChild>
              <input type="submit" value="Save" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTitleDialog;
