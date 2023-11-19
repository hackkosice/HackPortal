import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import { FormFieldValueType } from "@/server/services/helpers/applicationForm/getStepDataForForm";

type FieldValue =
  | {
      value: string | null;
      option: { id: number; value: string } | null;
      file: { id: number; name: string } | null;
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
    file,
    field: { type },
  } = fieldValue;
  if (type === FormFieldTypeEnum.checkbox) {
    return value === "true";
  }

  if (value) {
    return value;
  }

  if (file) {
    return file.name;
  }

  if (option) {
    return String(option.id);
  }

  return null;
};

export default getFormFieldInitialValue;
