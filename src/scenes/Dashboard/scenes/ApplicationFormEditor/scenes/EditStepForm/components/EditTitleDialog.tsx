"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
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
import editStep from "@/server/actions/dashboard/editStep";

const titleEditFormSchema = z.object({
  title: z.string(),
});

type TitleEditForm = z.infer<typeof titleEditFormSchema>;

export type Props = {
  stepId: number;
  initialValue?: string;
};

const EditTitleDialog = ({ initialValue, stepId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<TitleEditForm>({
    resolver: zodResolver(titleEditFormSchema),
    defaultValues: {
      title: initialValue ?? "",
    },
  });

  const onEditTitleModalSave = async ({ title }: TitleEditForm) => {
    await editStep({ stepId, title });
    setIsOpened(false);
  };

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button variant="outline" size="small" className="w-fit">
          <PencilSquareIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
          Edit title
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit title of the step</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditTitleModalSave)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New title</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Field label" {...field} />
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

export default EditTitleDialog;
