import getLocalApplicationFieldData from "@/services/helpers/localData/getLocalApplicationFieldData";
import { mockLocalStorageData } from "@/services/jest/localdata-factory";

describe("getLocalApplicationFieldData", () => {
  it("should return the data if there is a matching field", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const data = getLocalApplicationFieldData(1, "text");
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual({
      fieldId: 1,
      stepId: 1,
      fieldType: "text",
      value: "test",
    });
  });

  it("should return null if there is no matching field", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const data = getLocalApplicationFieldData(2, "text");
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual(null);
  });

  it("should return null if there is no local application data", () => {
    mockLocalStorageData(undefined);
    const data = getLocalApplicationFieldData(1, "text");
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual(null);
  });

  it("should return correct data if the field type is a checkbox", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "checkbox",
        value: "true",
      },
    ]);
    const data = getLocalApplicationFieldData(1, "checkbox");
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual({
      fieldId: 1,
      stepId: 1,
      fieldType: "checkbox",
      value: true,
    });
  });
});
