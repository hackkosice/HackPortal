import { ApplicationStepData } from "@/server/getters/application/application";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";

const getLocalApplicationDataStepCompleted = (
  step: ApplicationStepData
): boolean => {
  const requiredFields = step.formFields.filter((field) => field.required);
  if (requiredFields.length === 0) {
    return true;
  }

  const localApplicationData = getLocalApplicationData();
  if (!localApplicationData) {
    return false;
  }

  for (const field of requiredFields) {
    const matchingField = localApplicationData.find(
      (f) => f.fieldId === field.id
    );
    if (!matchingField?.value) {
      return false;
    }
  }
  return true;
};

export default getLocalApplicationDataStepCompleted;
