"use client";

import React, { useEffect, useState } from "react";
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
import newOptionList from "@/server/actions/dashboard/optionListManager/newOptionList";

const newOptionListFormSchema = z.object({
  name: z.string().min(1),
});

type NewOptionListForm = z.infer<typeof newOptionListFormSchema>;

const NewOptionListDialog = () => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewOptionListForm>({
    resolver: zodResolver(newOptionListFormSchema),
  });

  const onEditTitleModalSave = async ({ name }: NewOptionListForm) => {
    await newOptionList({ name });
    setIsOpened(false);
  };

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-5 w-5 mr-1" />
          Add new list
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Option list name</FormLabel>
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewOptionListDialog;
