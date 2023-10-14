/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormFieldData,
  FormFieldValueType,
} from "@/server/getters/applicationFormStep";
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

export type Props = {
  formField: FormFieldData;
  form: UseFormReturn<{ [p: string]: FormFieldValueType }>;
};

const DynamicFormField = ({ form, formField }: Props) => {
  const { label, name, type, optionList, required } = formField;
  switch (type) {
    case FormFieldTypeEnum.text:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel required={required}>{label}</FormLabel>
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
              <FormLabel required={required}>{label}</FormLabel>
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
              <FormLabel>{label}</FormLabel>
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
    case FormFieldTypeEnum.select:
      return (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel required={required}>{label}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
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
              <span className="flex items-center">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={(checked) => {
                      if (checked !== "indeterminate") {
                        field.onChange(checked);
                      }
                    }}
                  />
                </FormControl>
                <FormLabel
                  className="ml-1 !mt-0 cursor-pointer"
                  required={required}
                >
                  {label}
                </FormLabel>
              </span>
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
  return null;
};

export default DynamicFormField;
