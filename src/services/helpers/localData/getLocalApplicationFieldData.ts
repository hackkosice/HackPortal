import { LocalApplicationFieldData } from "@/services/helpers/localData/types";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";

const getLocalApplicationFieldData = (
  fieldId: number
): LocalApplicationFieldData | null => {
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

  return matchingField;
};

export default getLocalApplicationFieldData;
