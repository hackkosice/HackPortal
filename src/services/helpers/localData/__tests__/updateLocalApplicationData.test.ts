import updateLocalApplicationData from "@/services/helpers/localData/updateLocalApplicationData";
import { mockLocalStorageData } from "@/services/jest/localdata-factory";
import { FormFieldTypeEnum } from "@/services/types/formFields";

describe("updateLocalApplicationData", () => {
  it("should update the existing field in local application data", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const fieldValues = [
      {
        fieldId: 1,
        fieldType: FormFieldTypeEnum.text,
        value: "test2",
      },
    ];
    const stepId = 1;
    updateLocalApplicationData({ fieldValues, stepId });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "applicationData",
      JSON.stringify([
        {
          fieldId: 1,
          fieldType: "text",
          value: "test2",
          stepId: 1,
        },
      ])
    );
  });
  it("should add a new field to the local application data", () => {
    mockLocalStorageData([
      {
        fieldId: 1,
        stepId: 1,
        fieldType: "text",
        value: "test",
      },
    ]);
    const fieldValues = [
      {
        fieldId: 2,
        fieldType: FormFieldTypeEnum.text,
        value: "test2",
      },
    ];
    const stepId = 1;
    updateLocalApplicationData({ fieldValues, stepId });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "applicationData",
      JSON.stringify([
        {
          fieldId: 1,
          stepId: 1,
          fieldType: "text",
          value: "test",
        },
        {
          fieldId: 2,
          fieldType: "text",
          value: "test2",
          stepId: 1,
        },
      ])
    );
  });

  it("should add a new field to the local application data if there is no local application data", () => {
    mockLocalStorageData(undefined);
    const fieldValues = [
      {
        fieldId: 1,
        fieldType: FormFieldTypeEnum.text,
        value: "test",
      },
    ];
    const stepId = 1;
    updateLocalApplicationData({ fieldValues, stepId });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "applicationData",
      JSON.stringify([
        {
          fieldId: 1,
          fieldType: "text",
          value: "test",
          stepId: 1,
        },
      ])
    );
  });
});
