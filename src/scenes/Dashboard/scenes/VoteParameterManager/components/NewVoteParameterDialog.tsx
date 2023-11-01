"use client";

import React, { useEffect } from "react";
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
import createNewVoteParameter from "@/server/actions/dashboard/voteParameterManager/createNewVoteParameter";
import editVoteParameter from "@/server/actions/dashboard/voteParameterManager/editVoteParameter";

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
  hackathonId?: number;
  isOpened: boolean;
  onOpenChange: (isOpened: boolean) => void;
  mode?: "create" | "edit";
  voteParameterId?: number;
  initialData?: NewVoteParameterForm;
};
const NewVoteParameterDialog = ({
  hackathonId,
  isOpened,
  onOpenChange,
  mode = "create",
  voteParameterId,
  initialData,
}: NewVoteParameterDialogProps) => {
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
    if (mode === "edit" && voteParameterId) {
      await editVoteParameter({
        ...data,
        voteParameterId,
      });
    } else if (mode === "create" && hackathonId) {
      await createNewVoteParameter({
        ...data,
        hackathonId,
      });
    }
    onOpenChange(false);
  };

  useEffect(() => {
    if (mode === "edit" && initialData && isOpened) {
      form.reset(initialData);
    } else if (mode === "create" && isOpened) {
      form.reset();
    }
  }, [isOpened, form, mode, initialData]);

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Create new vote parameter"
              : "Edit vote parameter"}
          </DialogTitle>
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
              <Button type="submit">
                {mode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewVoteParameterDialog;
