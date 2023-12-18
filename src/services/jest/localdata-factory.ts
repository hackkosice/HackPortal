import { LocalApplicationData } from "@/services/helpers/localData/types";

jest.spyOn(Storage.prototype, "getItem");
jest.spyOn(Storage.prototype, "setItem");

export const mockLocalStorageData = (
  data: LocalApplicationData | undefined
) => {
  Storage.prototype.getItem = jest.fn().mockImplementation(() => {
    return JSON.stringify(data);
  });
  Storage.prototype.setItem = jest.fn();
};
