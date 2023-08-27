/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DynamicFormField from "@/scenes/ApplicationFormStep/components/DynamicFormField";
import { Stack } from "@/components/Stack";
import getLocalApplicationFieldData from "@/services/helpers/localData/getLocalApplicationFieldData";
import { FormFieldData } from "@/server/getters/applicationFormStep";

export type Props = {
  onSubmit: (data: any) => void;
  actionButtons: React.ReactNode;
  formFields: FormFieldData[];
  shouldUseLocalInitialValues?: boolean;
};

const FormRenderer = ({
  actionButtons,
  formFields,
  onSubmit,
  shouldUseLocalInitialValues,
}: Props) => {
  const { handleSubmit, register, setValue } = useForm();
  useEffect(() => {
    // Fill initial values for form fields - either from localStorage or from the server
    formFields.forEach((formField) => {
      const initialValue = shouldUseLocalInitialValues
        ? getLocalApplicationFieldData(formField.id)?.value
        : formField.initialValue;
      if (!initialValue) return;

      switch (formField.type.value) {
        case "checkbox":
          setValue(String(formField.id), initialValue === "true");
          break;
        default:
          setValue(String(formField.id), initialValue);
      }
    });
  }, [formFields, setValue, shouldUseLocalInitialValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column">
        {formFields.map((formField: any) => (
          <DynamicFormField
            key={formField.id}
            label={formField.label}
            type={formField.type.value}
            required={formField.required}
            options={formField.optionList}
            register={register}
            name={String(formField.id)}
          />
        ))}
        {actionButtons}
      </Stack>
    </form>
  );
};

export default FormRenderer;
