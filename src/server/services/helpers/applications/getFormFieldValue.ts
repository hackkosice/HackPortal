export type FormFieldValue = string | null;

type GetFormFieldValueInput = {
  formValue:
    | {
        value: string | null;
        option: { value: string } | null;
        file: { name: string; path: string } | null;
        field: { id: number };
      }
    | undefined;
};
const getFormFieldValue = ({ formValue }: GetFormFieldValueInput) => {
  if (!formValue) {
    return null;
  }

  if (formValue.option) {
    return formValue.option.value;
  }

  if (formValue.file) {
    return formValue.file.name;
  }

  return formValue.value;
};

export default getFormFieldValue;
