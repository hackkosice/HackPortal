"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@/components/Stack";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { trpc } from "@/services/trpc";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Props = {
  stepId: number;
};

const newFieldFormSchema = z.object({
  label: z.string(),
  typeId: z.string(),
  required: z.boolean(),
});

type NewFieldForm = z.infer<typeof newFieldFormSchema>;

const NewFieldDialog = ({ stepId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const utils = trpc.useContext();
  const { data: dataFieldTypes } = trpc.formFieldTypes.useQuery();
  const { mutateAsync: newFormField } = trpc.newFormField.useMutation({
    onSuccess: () => {
      utils.stepInfo.invalidate();
    },
  });
  const form = useForm<NewFieldForm>({
    resolver: zodResolver(newFieldFormSchema),
  });

  const onNewFieldSubmit = async ({
    label,
    typeId,
    required,
  }: NewFieldForm) => {
    await newFormField({
      label,
      stepId,
      name: label,
      typeId: Number(typeId),
      required,
    });
    setIsOpened(false);
  };

  useEffect(() => {
    form.reset();
  }, [isOpened, form]);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        <Button>Create new field</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new field</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onNewFieldSubmit)}>
            <Stack direction="column">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Field label" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a field type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataFieldTypes?.data.map((fieldType) => (
                          <SelectItem
                            key={fieldType.id}
                            value={String(fieldType.id)}
                          >
                            {fieldType.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          if (checked !== "indeterminate") {
                            field.onChange(checked);
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>Required field</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button asChild>
                  <input type="submit" value="Add new field" />
                </Button>
              </DialogFooter>
            </Stack>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFieldDialog;
