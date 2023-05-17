type FormValues = {
  value: string | null;
  option: { value: string } | null;
  field: { type: { value: string }; label: string };
};

const createFormValuesObject = (
  formValues: FormValues[]
): { [key: string]: string } => {
  const result = {} as { [key: string]: string };

  for (const formValue of formValues) {
    const value = formValue.value ? formValue.value : formValue.option?.value;
    result[formValue.field.label] = value ?? "";
  }

  return result;
};

export default createFormValuesObject;
