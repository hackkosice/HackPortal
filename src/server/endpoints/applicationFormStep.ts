import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

type FieldValue =
  | {
      value: string | null;
      option: { id: number; value: string } | null;
      field: { type: { value: string }; id: number; stepId: number };
    }
  | undefined;

const getInitialValue = (fieldValue: FieldValue) => {
  if (!fieldValue) {
    return null;
  }

  const { value, option } = fieldValue;

  if (value) {
    return value;
  }

  if (option) {
    return option.id;
  }

  return null;
};

export type ApplicationFormStepData = {
  message: string;
  signedIn: boolean;
  data: {
    title: string;
    stepNumber: number;
    formFields: {
      id: number;
      formFieldNumber: number;
      name: string;
      label: string;
      type: { value: string };
      initialValue: string | null | number;
      optionList: { value: string; label: string }[] | undefined;
      required: boolean;
    }[];
  };
};

const getApplicationFormStep = async (
  stepId: number
): Promise<ApplicationFormStepData> => {
  const session = await getServerSession(authOptions);

  const stepFormFields = await prisma.applicationFormStep.findUnique({
    select: {
      id: true,
      title: true,
      stepNumber: true,
      formFields: {
        select: {
          id: true,
          formFieldNumber: true,
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

  if (!stepFormFields) {
    throw new Error("Step not found");
  }

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

  const fieldValues = applicationFormFieldValues.formValues.filter(
    (value) => value.field.stepId === stepId
  );

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
      stepNumber: stepFormFields.stepNumber,
      formFields: resultFields,
    },
  };
};

export default getApplicationFormStep;
