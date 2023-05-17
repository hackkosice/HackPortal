import React from "react";
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Stack } from "@/components/Stack";

type Props = {
  question: string;
  isOpened: boolean;
  onClose: (value: boolean) => void;
};

const ConfirmationModal = ({ question, isOpened, onClose }: Props) => {
  return (
    <Modal isOpened={isOpened} onClose={() => onClose(false)}>
      <Text spaceAfter="medium">{question}</Text>
      <Stack direction="row">
        <Button label="Yes" onClick={() => onClose(true)} />
        <Button
          label="No"
          onClick={() => onClose(false)}
          colorType="secondary"
        />
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
