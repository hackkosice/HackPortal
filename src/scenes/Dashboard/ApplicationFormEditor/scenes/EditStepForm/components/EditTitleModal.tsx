import React, { useEffect } from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";

type TitleEditForm = {
  title: string;
};

export type Props = {
  isOpened: boolean;
  onClose: () => void;
  stepId: number;
  initialValue?: string;
};

const EditTitleModal = ({ isOpened, onClose, initialValue, stepId }: Props) => {
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
    onClose();
  };

  useEffect(() => {
    if (isOpened) {
      setTitleEditValue("title", initialValue ?? "");
    }
  }, [initialValue, setTitleEditValue, isOpened]);

  return (
    <Modal isOpened={isOpened} onClose={onClose}>
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
  );
};

export default EditTitleModal;
