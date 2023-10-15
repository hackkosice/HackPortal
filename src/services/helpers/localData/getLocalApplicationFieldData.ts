import { LocalApplicationFieldDataParsed } from "@/services/helpers/localData/types";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";

const getLocalApplicationFieldData = (
  fieldId: number,
  fieldType: FormFieldType
): LocalApplicationFieldDataParsed | null => {
  const localApplicationData = getLocalApplicationData();
  if (!localApplicationData) {
    return null;
  }

  const matchingField = localApplicationData.find(
    (field) => field.fieldId === fieldId
  );
  if (!matchingField) {
    return null;
  }

  if (fieldType === FormFieldTypeEnum.checkbox) {
    return {
      ...matchingField,
      value: matchingField.value === "true",
    };
  }

  return matchingField;
};

export default getLocalApplicationFieldData;
