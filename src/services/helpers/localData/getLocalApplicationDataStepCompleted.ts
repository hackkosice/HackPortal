import { ApplicationStepData } from "@/server/getters/application";
import {
  LOCAL_STORAGE_APPLICATION_DATA,
  LocalApplicationData,
} from "@/services/helpers/localData/types";

const getLocalApplicationDataStepCompleted = (
  step: ApplicationStepData
): boolean => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA);
  if (!savedData) {
    return false;
  }

  const parsedData = JSON.parse(savedData) as LocalApplicationData;

  const requiredFields = step.formFields.filter((field) => field.required);
  for (const field of requiredFields) {
    const matchingField = parsedData.find((f) => f.fieldId === field.id);
    if (!matchingField?.value) {
      return false;
    }
  }
  return true;
};

export default getLocalApplicationDataStepCompleted;
