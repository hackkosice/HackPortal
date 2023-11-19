import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import { prisma } from "@/services/prisma";
import createKeyForFormFileUpload from "@/server/services/helpers/fileUpload/createKeyForFormFileUpload";

type FieldValue = {
  fieldId: number;
  value: string;
};

const saveValue = async (
  applicationId: number,
  fieldId: number,
  values: {
    value?: string;
    optionId?: number;
    fileId?: number;
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

type SaveFormFieldValueInput = {
  applicationId: number;
  stepId: number;
  userId: number;
  fieldValue: FieldValue;
};

const saveFormFieldValue = async ({
  applicationId,
  stepId,
  userId,
  fieldValue,
}: SaveFormFieldValueInput) => {
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
      await saveValue(applicationId, fieldValue.fieldId, {
        value: fieldValue.value,
      });
      break;
    }
    case FormFieldTypeEnum.combobox:
    case FormFieldTypeEnum.radio:
    case FormFieldTypeEnum.select: {
      if (!fieldValue.value) {
        break;
      }
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
      await saveValue(applicationId, fieldValue.fieldId, {
        optionId: option.id,
      });
      break;
    }
    case FormFieldTypeEnum.file: {
      const fileName = fieldValue.value;
      if (!fileName) {
        break;
      }
      await prisma.file.deleteMany({
        where: {
          formFieldValue: {
            fieldId: fieldValue.fieldId,
          },
        },
      });
      const file = await prisma.file.create({
        select: {
          id: true,
        },
        data: {
          name: fileName,
          path: createKeyForFormFileUpload({
            stepId,
            fieldId: fieldValue.fieldId,
            userId,
          }),
        },
      });
      await saveValue(applicationId, fieldValue.fieldId, {
        fileId: file.id,
      });
    }
  }
};

export default saveFormFieldValue;
