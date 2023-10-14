export const FormFieldTypeEnum = {
  text: "text",
  textarea: "textarea",
  radio: "radio",
  select: "select",
  file: "file",
  checkbox: "checkbox",
  combobox: "combobox",
} as const;
export type FormFieldType =
  (typeof FormFieldTypeEnum)[keyof typeof FormFieldTypeEnum];
