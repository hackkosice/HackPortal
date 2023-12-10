/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFieldTypeEnum } from "@/services/types/formFields";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Stack } from "@/components/ui/stack";
import MarkDownRenderer from "@/components/common/MarkDownRenderer";
import {
  FormFieldData,
  FormFieldValueType,
} from "@/server/services/helpers/applicationForm/getStepDataForForm";
import formatBytesToString from "@/services/helpers/formatBytesToString";
import Tooltip from "@/components/common/Tooltip";
import { Combobox } from "@/components/ui/combobox";
import { AlertCircleIcon } from "lucide-react";

export type Props = {
  formField: FormFieldData;
  form: UseFormReturn<{ [p: string]: FormFieldValueType | File }>;
};

const DynamicFormField = ({ form, formField }: Props) => {
  const [shouldOverrideUploadedFile, setShouldOverrideUploadedFile] =
    useState(false);
  const { label, name, description, type, optionList, required } = formField;
  const tooltip = formField.description ? (
    <Tooltip
      trigger={
        <InformationCircleIcon className="h-5 w-5 text-hkOrange cursor-pointer" />
      }
      content={description}
    />
  ) : null;
  switch (type) {
    case FormFieldTypeEnum.text:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <FormControl>
                <Input {...field} type="text" value={field.value as string} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.textarea:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.radio:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                  className="flex flex-col space-y-1"
                >
                  {optionList?.map(({ value, label: optionLabel }) => (
                    <FormItem
                      className="flex items-center space-x-3 space-y-0"
                      key={value}
                    >
                      <FormControl>
                        <RadioGroupItem value={value} />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {optionLabel}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.combobox:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <Combobox
                options={optionList ?? []}
                selectedOption={field.value as string}
                onSelectOption={(value) => {
                  form.setValue(name, value);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.select:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionList?.map(({ value, label: optionLabel }) => (
                    <SelectItem key={value} value={value}>
                      {optionLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.checkbox:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <span className="flex items-start">
                <FormControl>
                  <Checkbox
                    className="mt-1"
                    checked={field.value as boolean}
                    onCheckedChange={(checked) => {
                      if (checked !== "indeterminate") {
                        field.onChange(checked);
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="ml-1 cursor-pointer" required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
              </span>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case FormFieldTypeEnum.file:
      if (!formField.fileUploadKey) {
        return (
          <FormField
            control={form.control}
            name={name}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <Stack direction="row" spacing="small" alignItems="center">
                  <FormLabel required={required}>
                    <MarkDownRenderer markdown={label} />
                  </FormLabel>
                  {tooltip}
                </Stack>
                <FormControl>
                  <Input
                    {...field}
                    type="file"
                    disabled
                    className="cursor-pointer py-2 h-auto"
                  />
                </FormControl>
                <Stack direction="row" alignItems="center" className="gap-1">
                  <AlertCircleIcon className="text-red-500 h-5 w-5" />
                  <Text size="small" className="text-red-500">
                    You can upload files after you create an account
                  </Text>
                </Stack>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      }
      if (formField.initialValue && !shouldOverrideUploadedFile) {
        return (
          <FormItem>
            <Stack direction="row" spacing="small" alignItems="center">
              <FormLabel required={required}>
                <MarkDownRenderer markdown={label} />
              </FormLabel>
              {tooltip}
            </Stack>
            <Text size="small">
              You have already uploaded file:{" "}
              <a
                href={formField.uploadedFileUrl}
                target="_blank"
                className="font-bold underline"
              >
                {formField.initialValue}
              </a>
            </Text>
            <Button
              variant="link"
              size="small"
              onClick={() => setShouldOverrideUploadedFile(true)}
            >
              Replace the uploaded file with new one
            </Button>
          </FormItem>
        );
      }
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <Stack direction="row" spacing="small" alignItems="center">
                <FormLabel required={required}>
                  <MarkDownRenderer markdown={label} />
                </FormLabel>
                {tooltip}
              </Stack>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  className="cursor-pointer py-2 h-auto"
                  onChange={(event) =>
                    onChange(event.currentTarget.files?.[0] ?? null)
                  }
                />
              </FormControl>
              {value && (
                <Text className="text-xs">
                  Uploaded file: {(value as File).name} (
                  {formatBytesToString((value as File).size)})
                </Text>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
  return null;
};

export default DynamicFormField;
