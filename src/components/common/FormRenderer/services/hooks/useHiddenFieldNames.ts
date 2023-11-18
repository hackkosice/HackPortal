import { useEffect, useMemo } from "react";
import { FormFieldData } from "@/server/services/helpers/applicationForm/getStepDataForForm";
import { UseFormReturn } from "react-hook-form";

const useHiddenFieldNames = (
  formFields: FormFieldData[],
  form: UseFormReturn
) => {
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

  return hiddenFieldNames;
};

export default useHiddenFieldNames;
