"use client";

import React, { useEffect, useState } from "react";
import { Stack } from "@/components/ui/stack";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createNewFormField from "@/server/actions/dashboard/createNewFormField";
import { FormFieldTypesData } from "@/server/getters/dashboard/formFieldTypes";

export type Props = {
  stepId: number;
  formFieldTypes: FormFieldTypesData;
};

const newFieldFormSchema = z.object({
  label: z.string().min(1),
  name: z.string().min(1),
  typeId: z.string().min(1),
  required: z.boolean().optional(),
});

type NewFieldForm = z.infer<typeof newFieldFormSchema>;

const NewFieldDialog = ({ stepId, formFieldTypes }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewFieldForm>({
    resolver: zodResolver(newFieldFormSchema),
    defaultValues: {
      label: "",
      name: "",
      typeId: "",
      required: false,
    },
  });

  const onNewFieldSubmit = async ({
    label,
    name,
    typeId,
    required,
  }: NewFieldForm) => {
    await createNewFormField({
      label,
      name,
      stepId,
      typeId: Number(typeId),
      required: Boolean(required),
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name (has to be unique across the form)
                    </FormLabel>
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
                        {formFieldTypes.map((fieldType) => (
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
                    <span className="flex items-center">
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
                      <FormLabel className="ml-1 !mt-0 cursor-pointer">
                        Required
                      </FormLabel>
                    </span>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Create new field</Button>
              </DialogFooter>
            </Stack>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewFieldDialog;
