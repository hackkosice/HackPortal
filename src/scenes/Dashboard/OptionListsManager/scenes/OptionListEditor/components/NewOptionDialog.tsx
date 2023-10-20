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
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import createNewOptions from "@/server/actions/dashboard/optionListManager/createNewOptions";

const newOptionFormSchema = z.object({
  value: z.string().min(1),
});

type NewOptionForm = z.infer<typeof newOptionFormSchema>;

type NewOptionListDialogProps = {
  optionListId: number;
};
const NewOptionDialog = ({ optionListId }: NewOptionListDialogProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewOptionForm>({
    resolver: zodResolver(newOptionFormSchema),
  });

  const onNewOptiontSave = async ({ value }: NewOptionForm) => {
    await createNewOptions({
      optionListId,
      options: [value],
    });
    setIsOpened(false);
  };

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button size="small">
          <PlusCircleIcon className="h-5 w-5 mr-1" />
          Add new option
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new option</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewOptiontSave)}>
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option value</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-5">
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOptionDialog;
