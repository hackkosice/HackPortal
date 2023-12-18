import getLocalApplicationDataStepCompleted from "@/services/helpers/localData/getLocalApplicationDataStepCompleted";
import { mockLocalStorageData } from "@/services/jest/localdata-factory";

describe("getLocalApplicationDataStepCompleted", () => {
  it("should return true if all required fields have a value", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const step = {
      id: 1,
      title: "test",
      position: 1,
      isCompleted: false,
      formFields: [
        {
          id: 1,
          required: true,
          type: {
            value: "text",
          },
        },
      ],
    };
    const data = getLocalApplicationDataStepCompleted(step);
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual(true);
  });

  it("should return false if a required field does not have a value", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "",
      },
    ]);
    const step = {
      id: 1,
      title: "test",
      position: 1,
      isCompleted: false,
      formFields: [
        {
          id: 1,
          required: true,
          type: {
            value: "text",
          },
        },
      ],
    };
    const data = getLocalApplicationDataStepCompleted(step);
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual(false);
  });

  it("should return false if there is no local application data", () => {
    mockLocalStorageData(undefined);
    const step = {
      id: 1,
      title: "test",
      position: 1,
      isCompleted: false,
      formFields: [
        {
          id: 1,
          required: true,
          type: {
            value: "text",
          },
        },
      ],
    };
    const data = getLocalApplicationDataStepCompleted(step);
    expect(localStorage.getItem).toHaveBeenCalledWith("applicationData");
    expect(data).toEqual(false);
  });

  it("should return true if there are no required fields", () => {
    mockLocalStorageData(undefined);
    const step = {
      id: 1,
      title: "test",
      position: 1,
      isCompleted: false,
      formFields: [
        {
          id: 1,
          required: false,
          type: {
            value: "text",
          },
        },
      ],
    };
    const data = getLocalApplicationDataStepCompleted(step);
    expect(data).toEqual(true);
  });
});
