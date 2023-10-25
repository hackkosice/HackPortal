"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import editOption from "@/server/actions/dashboard/optionListManager/editOption";

const editOptionFormSchema = z.object({
  value: z.string().min(1),
});

type EditOptionForm = z.infer<typeof editOptionFormSchema>;

type EditOptionDialogProps = {
  optionId: number;
  initialValue: string;
  isOpened: boolean;
  onClose: () => void;
};
const EditOptionDialog = ({
  optionId,
  initialValue,
  isOpened,
  onClose,
}: EditOptionDialogProps) => {
  const form = useForm<EditOptionForm>({
    resolver: zodResolver(editOptionFormSchema),
    defaultValues: {
      value: initialValue,
    },
  });

  const onEditOptionSave = async ({ value }: EditOptionForm) => {
    await editOption({ optionId, newValue: value });
    onClose();
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
      open={isOpened}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit option</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditOptionSave)}>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option value</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="My option list"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOptionDialog;
