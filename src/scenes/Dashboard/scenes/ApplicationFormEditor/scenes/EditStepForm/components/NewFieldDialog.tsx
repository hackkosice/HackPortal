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
import { FormFieldTypesWithOptions } from "@/services/types/formFields";
import { OptionListsData } from "@/server/getters/dashboard/optionListManager/getOptionLists";
import { PencilIcon } from "@heroicons/react/24/solid";
import editFormField from "@/server/actions/dashboard/editFormField";

const newFieldFormSchema = z.object({
  label: z.string().min(1),
  name: z.string().min(1),
  typeId: z.string().min(1),
  optionListId: z.string().min(1).optional(),
  required: z.boolean().optional(),
});

type NewFieldForm = z.infer<typeof newFieldFormSchema>;

export type Props = {
  stepId?: number;
  formFieldTypes: FormFieldTypesData;
  optionLists: OptionListsData;
  mode?: "create" | "edit";
  formFieldId?: number;
  initialData?: NewFieldForm;
};

const NewFieldDialog = ({
  stepId,
  formFieldTypes,
  optionLists,
  mode = "create",
  formFieldId,
  initialData,
}: Props) => {
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

  const selectedFieldId = form.watch("typeId");
  const selectedFieldType = formFieldTypes.find(
    (fieldType) => fieldType.id === Number(selectedFieldId)
  );
  const hasOptions =
    selectedFieldType &&
    FormFieldTypesWithOptions.includes(selectedFieldType.value);

  const onNewFieldSubmit = async ({
    label,
    name,
    typeId,
    required,
    optionListId,
  }: NewFieldForm) => {
    if (mode === "edit" && formFieldId) {
      await editFormField({
        formFieldId,
        label,
        name,
        typeId: Number(typeId),
        required: Boolean(required),
        optionListId: optionListId ? Number(optionListId) : undefined,
      });
    } else if (mode === "create" && stepId) {
      await createNewFormField({
        label,
        name,
        stepId,
        typeId: Number(typeId),
        required: Boolean(required),
        optionListId: optionListId ? Number(optionListId) : undefined,
      });
    }

    setIsOpened(false);
  };

  useEffect(() => {
    if (mode === "edit" && initialData && isOpened) {
      form.reset(initialData);
    } else if (mode === "create" && isOpened) {
      form.reset();
    }
  }, [initialData, mode, form, isOpened]);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>Create new field</Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit field ${initialData?.name}`}
          >
            <PencilIcon className="h-4 w-4 text-hkOrange" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add new field" : "Edit field"}
          </DialogTitle>
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
              {hasOptions && (
                <FormField
                  control={form.control}
                  name="optionListId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connected option list</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option list" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {optionLists.map((optionList) => (
                            <SelectItem
                              key={optionList.id}
                              value={String(optionList.id)}
                            >
                              {optionList.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                <Button type="submit">
                  {mode === "create" ? "Save new field" : "Save field"}
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