import { PrismaClient } from "@prisma/client";
import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";

type FieldValue = {
  fieldId: number;
  value: string;
};

const saveValue = async (
  prisma: PrismaClient,
  applicationId: number,
  fieldId: number,
  values: {
    value?: string;
    optionId?: number;
  }
) => {
  await prisma.applicationFormFieldValue.upsert({
    create: {
      applicationId,
      fieldId,
      ...values,
    },
    update: {
      ...values,
    },
    where: {
      applicationId_fieldId: {
        applicationId,
        fieldId,
      },
    },
  });
};

const saveFormFieldValue = async (
  prisma: PrismaClient,
  applicationId: number,
  fieldValue: FieldValue
) => {
  const fieldType = await prisma.formField.findUnique({
    select: {
      type: {
        select: {
          value: true,
        },
      },
    },
    where: {
      id: fieldValue.fieldId,
    },
  });
  if (!fieldType) {
    throw new Error("Provided fieldId not found in database");
  }
  const fieldTypeValue = fieldType.type.value as FormFieldType;
  switch (fieldTypeValue) {
    case FormFieldTypeEnum.text:
    case FormFieldTypeEnum.textarea:
    case FormFieldTypeEnum.checkbox: {
      await saveValue(prisma, applicationId, fieldValue.fieldId, {
        value: fieldValue.value,
      });
      break;
    }
    case FormFieldTypeEnum.select: {
      const option = await prisma.option.findUnique({
        select: {
          id: true,
        },
        where: {
          id: Number(fieldValue.value),
        },
      });
      if (!option) {
        throw new Error("Option not found");
      }
      await saveValue(prisma, applicationId, fieldValue.fieldId, {
        optionId: option.id,
      });
      break;
    }
  }
};

export default saveFormFieldValue;
