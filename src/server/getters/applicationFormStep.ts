import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FormFieldType } from "@/services/types/formFields";
import getFormFieldInitialValue from "@/server/services/helpers/applicationForm/getFormFieldInitialValue";
import getStepDataForForm, {
  FormFieldData,
} from "@/server/services/helpers/applicationForm/getStepDataForForm";

export type ApplicationFormStepData = {
  message: string;
  signedIn: boolean;
  data: {
    title: string;
    description: string | null;
    position: number;
    formFields: FormFieldData[];
  };
};

const getApplicationFormStep = async (
  stepId: number
): Promise<ApplicationFormStepData> => {
  const session = await getServerSession(authOptions);

  const stepFormFields = await getStepDataForForm(stepId);

  // If user is not signed in return steps with empty initial values
  if (!session?.id) {
    return {
      message: "Steps found",
      signedIn: false,
      data: stepFormFields,
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

  const applicationFormFieldValues =
    await prisma.applicationFormFieldValue.findMany({
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
            id: true,
            type: {
              select: {
                value: true,
              },
            },
          },
        },
      },
      where: {
        AND: [
          {
            application: {
              hackerId: hacker.id,
            },
          },
          {
            field: {
              stepId,
            },
          },
        ],
      },
    });

  const fieldValues = applicationFormFieldValues.map((value) => ({
    ...value,
    field: {
      ...value.field,
      type: value.field.type.value as FormFieldType,
    },
  }));

  const resultFields = stepFormFields.formFields.map((field) => ({
    ...field,
    initialValue: getFormFieldInitialValue(
      fieldValues.find((value) => value.field.id === field.id)
    ),
  }));

  return {
    message: "Steps found",
    signedIn: true,
    data: {
      title: stepFormFields.title,
      description: stepFormFields.description,
      position: stepFormFields.position,
      formFields: resultFields,
    },
  };
};

export default getApplicationFormStep;
