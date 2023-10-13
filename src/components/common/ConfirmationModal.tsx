import React from "react";
import { Modal } from "@/components/Modal";
import { Text } from "@/components/Text";
import { Button } from "@/components/ui/button";
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
        <Button onClick={() => onClose(true)}>Yes</Button>
        <Button onClick={() => onClose(false)} variant="outline">
          No
        </Button>
      </Stack>
    </Modal>
  );
};

export default ConfirmationModal;
