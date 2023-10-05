import { SaveApplicationStepFormInput } from "@/server/actions/saveApplicationStepForm";
import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";

const updateLocalApplicationData = (input: SaveApplicationStepFormInput) => {
  const localApplicationData = getLocalApplicationData();
  const newData = localApplicationData ?? [];
  for (const field of input) {
    const index = newData.findIndex((f) => f.fieldId === field.fieldId);
    if (index === -1) {
      newData.push(field);
    } else {
      newData[index] = field;
    }
  }
  localStorage.setItem("applicationData", JSON.stringify(newData));
};

export default updateLocalApplicationData;
