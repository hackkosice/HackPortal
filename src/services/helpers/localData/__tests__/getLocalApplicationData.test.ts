import getLocalApplicationData from "@/services/helpers/localData/getLocalApplicationData";
import { mockLocalStorageData } from "@/services/jest/localdata-factory";

describe("getLocalApplicationData", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the local application data", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const result = getLocalApplicationData();
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(result).toEqual([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
  });

  it("should return undefined if there is no local application data", () => {
    mockLocalStorageData(undefined);
    const result = getLocalApplicationData();
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(result).toEqual(undefined);
  });
});
