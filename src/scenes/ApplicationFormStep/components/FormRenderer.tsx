"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import DynamicFormField from "@/scenes/ApplicationFormStep/components/DynamicFormField";
import { Stack } from "@/components/ui/stack";
import getLocalApplicationFieldData from "@/services/helpers/localData/getLocalApplicationFieldData";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypeEnum } from "@/services/types/formFields";
import { FormFieldData } from "@/server/services/helpers/applicationForm/getStepDataForForm";

export type Props = {
  onSubmit: (data: any) => void;
  actionButtons: React.ReactNode;
  formFields: FormFieldData[];
  shouldUseLocalInitialValues?: boolean;
  className?: string;
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

  const targetFormFieldNames = useMemo(
    () =>
      Array.from(
        new Set(
          formFields
            .map(
              (formField) =>
                formField.formFieldVisibilityRule?.targetFormFieldName
            )
            .filter(Boolean) as string[]
        )
      ),
    [formFields]
  );

  const formValues = form.watch(targetFormFieldNames);
  const targetFormFieldValues = useMemo(
    () =>
      Object.fromEntries(
        targetFormFieldNames.map((targetFormFieldName, index) => [
          targetFormFieldName,
          formValues[index],
        ])
      ),
    [formValues, targetFormFieldNames]
  );
  const hiddenFieldNames = useMemo(
    () =>
      formFields
        .filter((formField) => {
          if (!formField.formFieldVisibilityRule) {
            return false;
          }
          const { targetOptionId, targetFormFieldName } =
            formField.formFieldVisibilityRule;
          const targetFormFieldValue =
            targetFormFieldValues[targetFormFieldName];
          return targetFormFieldValue !== targetOptionId.toString();
        })
        .map((formField) => formField.name),
    [formFields, targetFormFieldValues]
  );

  useEffect(() => {
    for (const fieldName of hiddenFieldNames) {
      form.setValue(fieldName, "");
    }
  }, [form, hiddenFieldNames]);

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
