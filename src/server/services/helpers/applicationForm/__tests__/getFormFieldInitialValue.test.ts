import getFormFieldInitialValue from "@/server/services/helpers/applicationForm/getFormFieldInitialValue";

describe("getFormFieldInitialValue", () => {
  it("should return null if value is undefined", () => {
    const res = getFormFieldInitialValue(undefined);
    expect(res).toBeNull();
  });

  it("should return correct value for text field", () => {
    const res = getFormFieldInitialValue({
      value: "text",
      option: null,
      file: null,
      field: { type: "text", id: 1 },
    });
    expect(res).toBe("text");
  });

  it("should return correct value for checkbox field", () => {
    const res = getFormFieldInitialValue({
      value: "true",
      option: null,
      file: null,
      field: { type: "checkbox", id: 1 },
    });
    expect(res).toBe(true);

    const res2 = getFormFieldInitialValue({
      value: "false",
      option: null,
      file: null,
      field: { type: "checkbox", id: 1 },
    });
    expect(res2).toBe(false);
  });

  it("should return correct value for select field", () => {
    const res = getFormFieldInitialValue({
      value: null,
      option: { id: 1, value: "option" },
      file: null,
      field: { type: "select", id: 1 },
    });
    expect(res).toBe("1");
  });

  it("should return correct value for file field", () => {
    const res = getFormFieldInitialValue({
      value: null,
      option: null,
      file: { id: 1, name: "file" },
      field: { type: "file", id: 1 },
    });
    expect(res).toBe("file");
  });
});
