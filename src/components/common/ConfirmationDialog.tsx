"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  question: string;
  children?: React.ReactNode;
  onAnswer: (value: boolean) => Promise<void>;
  isManuallyOpened?: boolean;
};

const ConfirmationDialog = ({
  question,
  children,
  onAnswer,
  isManuallyOpened,
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const onActionClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await onAnswer(true);
    if (typeof isManuallyOpened === "undefined") {
      setIsOpened(false);
    }
  };

  const onCancelClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await onAnswer(false);
    if (typeof isManuallyOpened === "undefined") {
      setIsOpened(false);
    }
  };

  useEffect(() => {
    if (typeof isManuallyOpened !== "undefined") {
      setIsOpened(isManuallyOpened);
    }
  }, [isManuallyOpened]);
  return (
    <AlertDialog open={isOpened} onOpenChange={setIsOpened}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{question}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button onClick={onActionClick}>Yes</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button
              onClick={onCancelClick}
              variant="outline"
              className="mb-2 md:mb-0"
            >
              No
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
