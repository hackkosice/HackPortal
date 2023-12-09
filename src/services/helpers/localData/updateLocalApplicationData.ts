import { SaveApplicationStepFormInput } from "@/server/actions/applicationForm/saveApplicationStepForm";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";

const updateLocalApplicationData = ({
  fieldValues,
  stepId,
}: SaveApplicationStepFormInput) => {
  const localApplicationData = getLocalApplicationData();
  const newData = localApplicationData ?? [];
  for (const field of fieldValues) {
    const index = newData.findIndex((f) => f.fieldId === field.fieldId);
    if (index === -1) {
      newData.push({
        ...field,
        stepId,
      });
    } else {
      newData[index] = {
        ...field,
        stepId,
      };
    }
  }
  localStorage.setItem("applicationData", JSON.stringify(newData));
};

export default updateLocalApplicationData;
