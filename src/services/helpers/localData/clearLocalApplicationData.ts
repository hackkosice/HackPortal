import { LOCAL_STORAGE_APPLICATION_DATA } from "@/services/helpers/localData/types";

const clearLocalApplicationData = () => {
  localStorage.removeItem(LOCAL_STORAGE_APPLICATION_DATA);
};

export default clearLocalApplicationData;
