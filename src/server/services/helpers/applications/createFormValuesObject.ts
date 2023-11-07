type FormValues = {
  value: string | null;
  option: { value: string } | null;
  field: { id: number };
}[];

type FormFields = {
  id: number;
  label: string;
}[];

export type ApplicationFormValuesObject = {
  [key: string]: string | null;
};
const createFormValuesObject = (
  formValues: FormValues,
  formFields: FormFields
): ApplicationFormValuesObject => {
  const result = {} as ApplicationFormValuesObject;

  for (const formField of formFields) {
    const formValue = formValues.find(
      (formValue) => formValue.field.id === formField.id
    );
    if (formValue) {
      const value = formValue.option?.value ?? formValue.value;
      result[formField.label] = value ?? "";
    } else {
      result[formField.label] = null;
    }
  }

  return result;
};

export default createFormValuesObject;
