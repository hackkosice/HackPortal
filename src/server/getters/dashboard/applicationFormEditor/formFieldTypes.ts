import { prisma } from "@/services/prisma";
import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type FormFieldTypesData = {
  id: number;
  value: FormFieldType;
}[];

const getFormFieldTypes = async (): Promise<FormFieldTypesData> => {
  await requireOrganizerSession();

  const formFieldTypes = await prisma.formFieldType.findMany();
  return Object.keys(FormFieldTypeEnum).map((key) => ({
    id: formFieldTypes.find((type) => type.value === key)?.id ?? 0,
    value: FormFieldTypeEnum[key as FormFieldType],
  }));
};

export default getFormFieldTypes;
