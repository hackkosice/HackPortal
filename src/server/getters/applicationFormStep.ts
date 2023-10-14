import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";

export type FormFieldValueType = string | boolean | null;

type FieldValue =
  | {
      value: string | null;
      option: { id: number; value: string } | null;
      field: { type: FormFieldType; id: number; stepId: number };
    }
  | undefined;

const getInitialValue = (fieldValue: FieldValue): FormFieldValueType => {
  if (!fieldValue) {
    return null;
  }

  const {
    value,
    option,
    field: { type },
  } = fieldValue;
  if (type === FormFieldTypeEnum.checkbox) {
    return value === "true";
  }

  if (value) {
    return value;
  }

  if (option) {
    return String(option.id);
  }

  return null;
};

export type FormFieldData = {
  id: number;
  position: number;
  name: string;
  label: string;
  type: FormFieldType;
  initialValue: FormFieldValueType;
  optionList: { value: string; label: string }[] | undefined;
  required: boolean;
};

export type ApplicationFormStepData = {
  message: string;
  signedIn: boolean;
  data: {
    title: string;
    position: number;
    formFields: FormFieldData[];
  };
};

const getApplicationFormStep = async (
  stepId: number
): Promise<ApplicationFormStepData> => {
  const session = await getServerSession(authOptions);

  const stepFormFieldsDb = await prisma.applicationFormStep.findUnique({
    select: {
      id: true,
      title: true,
      position: true,
      formFields: {
        select: {
          id: true,
          position: true,
          label: true,
          name: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
          optionList: {
            select: {
              options: {
                select: {
                  id: true,
                  value: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: stepId,
    },
  });

  if (!stepFormFieldsDb) {
    throw new Error("Step not found");
  }

  const stepFormFields = {
    ...stepFormFieldsDb,
    formFields: stepFormFieldsDb.formFields.map((field) => ({
      ...field,
      type: field.type.value as FormFieldType,
    })),
  };

  // If user is not signed in return steps with empty initial values
  if (!session?.id) {
    const resultFields = stepFormFields.formFields.map((field) => ({
      ...field,
      initialValue: null,
      optionList: field.optionList?.options.map((option) => ({
        value: String(option.id),
        label: option.value,
      })),
    }));
    const result = {
      ...stepFormFields,
      formFields: resultFields,
    };

    return {
      message: "Steps found",
      signedIn: false,
      data: result,
    };
  }

  const hacker = await prisma.hacker.findUnique({
    where: {
      userId: session.id,
    },
  });

  if (!hacker) {
    throw new Error("Hacker not found");
  }

  // Look for application form field values of given step
  const applicationFormFieldValues = await prisma.application.findUnique({
    select: {
      formValues: {
        select: {
          value: true,
          option: {
            select: {
              id: true,
              value: true,
            },
          },
          field: {
            select: {
              stepId: true,
              id: true,
              type: {
                select: {
                  value: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      hackerId: hacker.id,
    },
  });

  if (!applicationFormFieldValues) {
    throw new Error("Application not found");
  }

  const fieldValues = applicationFormFieldValues.formValues
    .filter((value) => value.field.stepId === stepId)
    .map((value) => ({
      ...value,
      field: {
        ...value.field,
        type: value.field.type.value as FormFieldType,
      },
    }));

  const resultFields = stepFormFields.formFields.map((field) => ({
    ...field,
    initialValue: getInitialValue(
      fieldValues.find((value) => value.field.id === field.id)
    ),
    optionList: field.optionList?.options.map((option) => ({
      value: String(option.id),
      label: option.value,
    })),
  }));

  return {
    message: "Steps found",
    signedIn: true,
    data: {
      title: stepFormFields.title,
      position: stepFormFields.position,
      formFields: resultFields,
    },
  };
};

export default getApplicationFormStep;
