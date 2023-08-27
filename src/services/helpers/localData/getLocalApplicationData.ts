import {
  LOCAL_STORAGE_APPLICATION_DATA,
  LocalApplicationData,
} from "@/services/helpers/localData/types";

const getLocalApplicationData = () => {
  const localData = localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA);
  if (localData) {
    return JSON.parse(localData) as LocalApplicationData;
  }
  return undefined;
};

export default getLocalApplicationData;
