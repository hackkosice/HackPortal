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
  typeId: z.string().min(1),
  optionListId: z.string().min(1).optional(),
  newOptionListName: z.string().min(1).optional(),
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
  name?: string;
};

const createName = (label: string) => {
  // Remove special characters and split the label into words
  const words = label.replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/);

  // Capitalize the first letter of each word except the first one
  const camelCaseWords = words.map((word, index) => {
    if (index === 0) {
      return word.toLowerCase(); // Keep the first word lowercase
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Join the words to create the camelCase string
  return camelCaseWords.join("");
};

const NewFieldDialog = ({
  stepId,
  formFieldTypes,
  optionLists,
  mode = "create",
  formFieldId,
  initialData,
  name,
}: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const form = useForm<NewFieldForm>({
    resolver: zodResolver(newFieldFormSchema),
    defaultValues: {
      label: "",
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
  const selectedOptionListId = form.watch("optionListId");
  const hasNewOptionList = selectedOptionListId === "new";

  const onNewFieldSubmit = async ({
    label,
    typeId,
    required,
    optionListId,
    newOptionListName,
  }: NewFieldForm) => {
    if (mode === "edit" && formFieldId) {
      await editFormField({
        formFieldId,
        label,
        name: createName(label),
        typeId: Number(typeId),
        required: Boolean(required),
        optionListId: optionListId ? Number(optionListId) : undefined,
        newOptionListName:
          optionListId === "new" ? newOptionListName : undefined,
      });
    } else if (mode === "create" && stepId) {
      await createNewFormField({
        label,
        name: createName(label),
        stepId,
        typeId: Number(typeId),
        required: Boolean(required),
        optionListId: optionListId ? Number(optionListId) : undefined,
        newOptionListName:
          optionListId === "new" ? newOptionListName : undefined,
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
          <Button variant="ghost" size="icon" aria-label={`Edit field ${name}`}>
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
                          <SelectItem value={"new"}>
                            (New empty option list)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {hasNewOptionList && (
                <FormField
                  control={form.control}
                  name="newOptionListName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New option list name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Option list name"
                          {...field}
                        />
                      </FormControl>
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
