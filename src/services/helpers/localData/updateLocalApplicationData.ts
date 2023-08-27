import { SaveApplicationStepFormInput } from "@/server/actions/saveApplicationStepForm";
import {
  LOCAL_STORAGE_APPLICATION_DATA,
  LocalApplicationData,
} from "@/services/helpers/localData/types";

const updateLocalApplicationData = (input: SaveApplicationStepFormInput) => {
  const savedData = localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA);
  const parsedData: LocalApplicationData = savedData
    ? JSON.parse(savedData)
    : [];
  for (const field of input) {
    const index = parsedData.findIndex((f) => f.fieldId === field.fieldId);
    if (index === -1) {
      parsedData.push(field);
    } else {
      parsedData[index] = field;
    }
  }
  localStorage.setItem("applicationData", JSON.stringify(parsedData));
};

export default updateLocalApplicationData;
