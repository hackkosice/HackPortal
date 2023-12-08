import { ApplicationStepData } from "@/server/getters/application/application";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";

const getLocalApplicationDataStepCompleted = (
  step: ApplicationStepData
): boolean => {
  const localApplicationData = getLocalApplicationData();
  if (!localApplicationData) {
    return false;
  }

  const requiredFields = step.formFields.filter((field) => field.required);
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
