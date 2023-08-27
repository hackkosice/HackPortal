import {
  LOCAL_STORAGE_APPLICATION_DATA,
  LocalApplicationData,
  LocalApplicationFieldData,
} from "@/services/helpers/localData/types";

const getLocalApplicationFieldData = (
  fieldId: number
): LocalApplicationFieldData | null => {
  const localApplicationData = localStorage.getItem(
    LOCAL_STORAGE_APPLICATION_DATA
  );
  if (!localApplicationData) {
    return null;
  }

  const parsedApplicationData = JSON.parse(
    localApplicationData
  ) as LocalApplicationData;
  const matchingField = parsedApplicationData.find(
    (field) => field.fieldId === fieldId
  );
  if (!matchingField) {
    return null;
  }

  return matchingField;
};

export default getLocalApplicationFieldData;
