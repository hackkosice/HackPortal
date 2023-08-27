import { PrismaClient } from "@prisma/client";

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
  switch (fieldType.type.value) {
    case "text":
    case "textarea":
    case "checkbox": {
      await saveValue(prisma, applicationId, fieldValue.fieldId, {
        value: fieldValue.value,
      });
      break;
    }
    case "select": {
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
