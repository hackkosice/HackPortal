import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import { FormFieldValueType } from "@/server/services/helpers/applicationForm/getStepFormFields";

type FieldValue =
  | {
      value: string | null;
      option: { id: number; value: string } | null;
      field: { type: FormFieldType; id: number };
    }
  | undefined;

const getFormFieldInitialValue = (
  fieldValue: FieldValue
): FormFieldValueType => {
  if (!fieldValue) {
    return null;
  }

  const {
    value,
    option,
    field: { type },
  } = fieldValue;
  if (type === FormFieldTypeEnum.checkbox) {
    return value === "true";
  }

  if (value) {
    return value;
  }

  if (option) {
    return String(option.id);
  }

  return null;
};

export default getFormFieldInitialValue;
