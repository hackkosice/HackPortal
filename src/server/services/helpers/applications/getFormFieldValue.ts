export type FormFieldValue = string | null;

type GetFormFieldValueInput = {
  formValue:
    | {
        value: string | null;
        option: { value: string } | null;
        field: { id: number };
      }
    | undefined;
};
const getFormFieldValue = ({ formValue }: GetFormFieldValueInput) => {
  if (!formValue) {
    return null;
  }

  return formValue.option?.value ?? formValue.value;
};

export default getFormFieldValue;
