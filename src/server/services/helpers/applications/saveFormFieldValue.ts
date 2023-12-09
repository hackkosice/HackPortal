import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import { prisma } from "@/services/prisma";
import createKeyForFormFileUpload from "@/server/services/helpers/fileUpload/createKeyForFormFileUpload";

export type FieldValue = {
  fieldId: number;
  stepId: number;
  fieldType: FormFieldType;
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
  userId: number;
  fieldValue: FieldValue;
};

const saveFormFieldValue = async ({
  applicationId,
  userId,
  fieldValue,
}: SaveFormFieldValueInput) => {
  switch (fieldValue.fieldType) {
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
            applicationId,
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
            stepId: fieldValue.stepId,
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
