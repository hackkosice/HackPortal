import createFormValuesObject from "@/server/services/helpers/applications/createFormValuesObject";
import getFormFieldValue from "@/server/services/helpers/applications/getFormFieldValue";
import isApplicationComplete, {
  isStepCompleted,
} from "@/server/services/helpers/applications/isApplicationComplete";
import { prismaMock } from "@/services/jest/prisma-singleton";
import { ApplicationFormFieldValue } from "@prisma/client";

const textValue = {
  value: "text",
  option: null,
  file: null,
  field: { id: 1 },
};
const optionValue = {
  value: null,
  option: { value: "option" },
  file: null,
  field: { id: 2 },
};
const fileValue = {
  value: null,
  option: null,
  file: { name: "cv.pdf", path: "path/cv.pdf" },
  field: { id: 3 },
};
const emptyValue = { value: null, option: null, file: null, field: { id: 4 } };

describe("getFormFieldValue", () => {
  it("should return the value based on the field type", () => {
    expect(getFormFieldValue({ formValue: undefined })).toBeNull();
    expect(getFormFieldValue({ formValue: textValue })).toBe("text");
    expect(getFormFieldValue({ formValue: optionValue })).toBe("option");
    expect(getFormFieldValue({ formValue: fileValue })).toBe("cv.pdf");
  });
});

describe("createFormValuesObject", () => {
  it("should map form values to field labels", () => {
    expect(
      createFormValuesObject(
        [textValue, optionValue, fileValue, emptyValue],
        [
          { id: 1, label: "Text" },
          { id: 2, label: "Option" },
          { id: 3, label: "File" },
          { id: 4, label: "Empty" },
          { id: 5, label: "Missing" },
        ]
      )
    ).toEqual({
      Text: "text",
      Option: "option",
      File: "cv.pdf",
      Empty: "",
      Missing: null,
    });
  });
});

describe("isApplicationComplete", () => {
  const fields = [
    { id: 1, required: true, type: { value: "text" } },
    { id: 2, required: false, type: { value: "text" } },
  ];
  const fieldValues = [{ fieldId: 1 }] as ApplicationFormFieldValue[];

  it("should check required fields of a step", () => {
    expect(isStepCompleted(fields, fieldValues)).toBe(true);
    expect(isStepCompleted(fields, [])).toBe(false);
  });

  it("should throw an error if the application is not found", async () => {
    prismaMock.applicationFormFieldValue.findMany.mockResolvedValue([]);
    prismaMock.application.findUnique.mockResolvedValue(null);
    await expect(isApplicationComplete(prismaMock, 1)).rejects.toThrow(
      "Application or hacker not found"
    );
  });

  it("should be complete only if all steps are completed", async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      id: 1,
      hacker: { hackathonId: 1 },
    } as never);
    prismaMock.applicationFormStep.findMany.mockResolvedValue([
      { formFields: fields },
    ] as never);

    prismaMock.applicationFormFieldValue.findMany.mockResolvedValue(
      fieldValues
    );
    expect(await isApplicationComplete(prismaMock, 1)).toBe(true);

    prismaMock.applicationFormFieldValue.findMany.mockResolvedValue([]);
    expect(await isApplicationComplete(prismaMock, 1)).toBe(false);
  });
});
