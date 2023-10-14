"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import DynamicFormField from "@/scenes/ApplicationFormStep/components/DynamicFormField";
import { Stack } from "@/components/ui/stack";
import getLocalApplicationFieldData from "@/services/helpers/localData/getLocalApplicationFieldData";
import { FormFieldData } from "@/server/getters/applicationFormStep";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypeEnum } from "@/services/types/formFields";

export type Props = {
  onSubmit: (data: any) => void;
  actionButtons: React.ReactNode;
  formFields: FormFieldData[];
  shouldUseLocalInitialValues?: boolean;
};

const mapToZodType = (formField: FormFieldData) => {
  switch (formField.type) {
    case FormFieldTypeEnum.text:
    case FormFieldTypeEnum.textarea:
    case FormFieldTypeEnum.select:
    case FormFieldTypeEnum.radio:
    case FormFieldTypeEnum.combobox:
      if (!formField.required) {
        return z.string().nullable();
      }
      return z.string().min(1, { message: "This field is required" });
    case FormFieldTypeEnum.checkbox:
      if (formField.required) {
        return z.literal(true, {
          errorMap: () => ({ message: "This field is required" }),
        });
      }
      return z.boolean().nullable();
    default:
      return z.string();
  }
};

const getDefaultValues = (
  formFields: FormFieldData[],
  shouldUseLocalInitialValues: boolean
) => {
  return Object.fromEntries(
    formFields.map((formField) => {
      const initialValue = shouldUseLocalInitialValues
        ? getLocalApplicationFieldData(formField.id)?.value ?? null
        : formField.initialValue;
      switch (formField.type) {
        case FormFieldTypeEnum.text:
        case FormFieldTypeEnum.textarea:
        case FormFieldTypeEnum.select:
        case FormFieldTypeEnum.radio:
        case FormFieldTypeEnum.combobox:
          return [formField.name, initialValue ?? ""];
        case FormFieldTypeEnum.checkbox:
          return [formField.name, initialValue ?? false];
        default:
          return [formField.name, initialValue ?? ""];
      }
    })
  );
};

const FormRenderer = ({
  actionButtons,
  formFields,
  onSubmit,
  shouldUseLocalInitialValues,
}: Props) => {
  const zodSchema = useMemo(
    () =>
      z.object(
        Object.fromEntries(
          formFields.map((formField) => {
            return [formField.name, mapToZodType(formField)];
          })
        )
      ),
    [formFields]
  );

  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: getDefaultValues(
      formFields,
      Boolean(shouldUseLocalInitialValues)
    ),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column">
          {formFields.map((formField: any) => (
            <DynamicFormField
              key={formField.id}
              form={form}
              formField={formField}
            />
          ))}
          {actionButtons}
        </Stack>
      </form>
    </Form>
  );
};

export default FormRenderer;
