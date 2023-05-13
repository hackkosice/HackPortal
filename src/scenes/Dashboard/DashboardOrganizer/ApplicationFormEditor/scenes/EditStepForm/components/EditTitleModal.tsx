import React, { useEffect } from "react";
import { Stack } from "@/components/Stack";
import { InputText } from "@/components/InputText";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { useForm } from "react-hook-form";

type TitleEditForm = {
  title: string;
};

export type Props = {
  isOpened: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialValue?: string;
};

const EditTitleModal = ({ isOpened, onClose, initialValue, onSave }: Props) => {
  const {
    register: registerTitleEdit,
    handleSubmit,
    setValue: setTitleEditValue,
  } = useForm<TitleEditForm>();

  const onEditTitleModalSave = async ({ title }: TitleEditForm) => {
    onSave(title);
  };

  useEffect(() => {
    setTitleEditValue("title", initialValue ?? "");
  }, [initialValue, setTitleEditValue]);

  return (
    <Modal isOpened={isOpened} closeOnOutsideClick={true} onClose={onClose}>
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
