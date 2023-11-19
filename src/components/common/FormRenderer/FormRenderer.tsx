"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import DynamicFormField from "@/components/common/FormRenderer/DynamicFormField";
import { Stack } from "@/components/ui/stack";
import getLocalApplicationFieldData from "@/services/helpers/localData/getLocalApplicationFieldData";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypeEnum } from "@/services/types/formFields";
import { FormFieldData } from "@/server/services/helpers/applicationForm/getStepDataForForm";
import useHiddenFieldNames from "@/components/common/FormRenderer/services/hooks/useHiddenFieldNames";

export type Props = {
  onSubmit: (data: any) => void;
  actionButtons: React.ReactNode;
  formFields: FormFieldData[];
  shouldUseLocalInitialValues?: boolean;
  className?: string;
};

const MAX_FILE_SIZE_IN_MB = 10;
const MAX_FILE_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024; // 10 MB
const fileValidator = z
  .custom<File>((v) => v instanceof File, {
    message: "File is required",
  })
  .refine((v) => v.size < MAX_FILE_SIZE, {
    message: `File is too big - max ${MAX_FILE_SIZE_IN_MB} MB`,
  })
  .refine((v) => v.type === "application/pdf", {
    message: "Only PDF files are allowed",
  });

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
    case FormFieldTypeEnum.file:
      if (!formField.required || formField.initialValue) {
        return fileValidator.nullable();
      }
      return fileValidator;
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
        ? getLocalApplicationFieldData(formField.id, formField.type)?.value ??
          null
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
        case FormFieldTypeEnum.file:
          return [formField.name, null];
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
  className,
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

  const hiddenFieldNames = useHiddenFieldNames(formFields, form);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack direction="column">
          <Stack direction="column" className={className}>
            {formFields.map((formField) => {
              if (hiddenFieldNames.includes(formField.name)) {
                return null;
              }
              return (
                <DynamicFormField
                  key={formField.id}
                  form={form}
                  formField={formField}
                />
              );
            })}
          </Stack>
          {actionButtons}
        </Stack>
      </form>
    </Form>
  );
};

export default FormRenderer;
