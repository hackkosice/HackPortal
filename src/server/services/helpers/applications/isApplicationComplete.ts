import { PrismaClient } from "@prisma/client";
import { ApplicationFormFieldValue } from "@prisma/client";

type StepField = {
  id: number;
  required: boolean;
  type: {
    value: string;
  };
};

/**
 * Checks if all required fields in a step are completed - have a value in the database
 * @param stepFields - fields in a step
 * @param fieldValues - values of fields in an application
 *
 * @returns true if all required fields are completed, false otherwise
 */
export const isStepCompleted = (
  stepFields: StepField[],
  fieldValues: ApplicationFormFieldValue[]
): boolean => {
  for (const field of stepFields) {
    if (
      field.required &&
      !fieldValues.find((value) => value.fieldId === field.id)
    ) {
      return false;
    }
  }
  return true;
};

const isApplicationComplete = async (
  prisma: PrismaClient,
  applicationId: number
): Promise<boolean> => {
  const fieldValues = await prisma.applicationFormFieldValue.findMany({
    where: {
      applicationId,
    },
  });

  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    select: {
      id: true,
      hacker: {
        select: {
          hackathonId: true,
        },
      },
      formValues: {
        select: {
          fieldId: true,
          value: true,
        },
      },
    },
  });

  if (!application || !application.hacker) {
    throw new Error("Application or hacker not found");
  }

  const { hackathonId } = application.hacker;

  const stepsDb = await prisma.applicationFormStep.findMany({
    where: {
      hackathonId,
    },
    select: {
      formFields: {
        select: {
          id: true,
          required: true,
          type: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  });

  for (const step of stepsDb) {
    if (!isStepCompleted(step.formFields, fieldValues)) {
      return false;
    }
  }

  return true;
};

export default isApplicationComplete;
