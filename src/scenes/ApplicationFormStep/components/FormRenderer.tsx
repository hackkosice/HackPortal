/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import DynamicFormField from "@/scenes/ApplicationFormStep/components/DynamicFormField";
import { Stack } from "@/components/Stack";

export type Props = {
  onSubmit: (data: any) => void;
  actionButtons: React.ReactNode;
  formFields: any;
};

const FormRenderer = ({ actionButtons, formFields, onSubmit }: Props) => {
  const { handleSubmit, register, setValue } = useForm();
  useEffect(() => {
    formFields.forEach((formField: any) => {
      if (formField.initialValue) {
        switch (formField.type.value) {
          case "checkbox":
            setValue(String(formField.id), formField.initialValue === "true");
            break;
          default:
            setValue(String(formField.id), formField.initialValue);
        }
      }
    });
  }, [formFields, setValue]);

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
