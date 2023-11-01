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
import createNewVoteParameter from "@/server/actions/dashboard/voteParameterManager/createNewVoteParameter";

const newVoteParameterFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  weight: z
    .number()
    .refine((maxValue) => maxValue !== 0, { message: "Value cannot be 0" }),
  minValue: z
    .number()
    .refine((maxValue) => maxValue !== 0, { message: "Value cannot be 0" }),
  maxValue: z
    .number()
    .refine((maxValue) => maxValue !== 0, { message: "Value cannot be 0" }),
});

type NewVoteParameterForm = z.infer<typeof newVoteParameterFormSchema>;

type NewVoteParameterDialogProps = {
  hackathonId: number;
};
const NewVoteParameterDialog = ({
  hackathonId,
}: NewVoteParameterDialogProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewVoteParameterForm>({
    resolver: zodResolver(newVoteParameterFormSchema),
    defaultValues: {
      name: "",
      description: "",
      weight: 0,
      minValue: 0,
      maxValue: 0,
    },
  });

  const onNewOptionListSave = async (data: NewVoteParameterForm) => {
    await createNewVoteParameter({
      ...data,
      hackathonId,
    });
    setIsOpened(false);
  };

  useEffect(() => {
    if (isOpened) {
      form.reset();
    }
  }, [isOpened, form]);

  return (
    <Dialog onOpenChange={setIsOpened} open={isOpened}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon className="h-5 w-5 mr-1" />
          Add new vote parameter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new vote parameter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewOptionListSave)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Vote parameter name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional description</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="The parameter should represent..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimal value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="min"
                      {...field}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          field.onChange("");
                        }
                        const parsedValue = parseInt(event.target.value);
                        if (isNaN(parsedValue)) {
                          return;
                        }
                        field.onChange(parseInt(event.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximal value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="max"
                      {...field}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          field.onChange("");
                        }
                        const parsedValue = parseInt(event.target.value);
                        if (isNaN(parsedValue)) {
                          return;
                        }
                        field.onChange(parseInt(event.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="weight"
                      {...field}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          field.onChange("");
                        }
                        const parsedValue = parseInt(event.target.value);
                        if (isNaN(parsedValue)) {
                          return;
                        }
                        field.onChange(parseInt(event.target.value));
                      }}
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

export default NewVoteParameterDialog;
