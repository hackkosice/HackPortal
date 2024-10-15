import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import getFormFieldInitialValue from "@/server/services/helpers/applicationForm/getFormFieldInitialValue";
import getStepDataForForm, {
  FormFieldData,
} from "@/server/services/helpers/applicationForm/getStepDataForForm";
import getPresignedDownloadUrl from "@/services/fileUpload/getPresignedDownloadUrl";

export type ApplicationFormStepData = {
  signedIn: boolean;
  data: {
    title: string;
    description: string | null;
    position: number;
    nextStepId: number | null;
    previousStepId: number | null;
    formFields: FormFieldData[];
  };
};

const getApplicationFormStep = async (
  stepId: number,
  hackathonId: number
): Promise<ApplicationFormStepData> => {
  const session = await getServerSession(authOptions);

  const stepFormFields = await getStepDataForForm({
    stepId,
    shouldSendFileUploadKey: true,
  });

  // If user is not signed in return steps with empty initial values
  if (!session?.id) {
    return {
      signedIn: false,
      data: stepFormFields,
    };
  }

  const hacker = await prisma.hacker.findFirst({
    where: {
      userId: session.id,
      hackathonId: hackathonId,
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
        file: {
          select: {
            id: true,
            name: true,
            path: true,
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

  const resultFields = await Promise.all(
    stepFormFields.formFields.map(async (field) => {
      const fieldValue = fieldValues.find(
        (value) => value.field.id === field.id
      );
      return {
        ...field,
        initialValue: getFormFieldInitialValue(
          fieldValues.find((value) => value.field.id === field.id)
        ),
        uploadedFileUrl:
          field.type === FormFieldTypeEnum.file && fieldValue?.file?.path
            ? await getPresignedDownloadUrl(fieldValue.file.path)
            : undefined,
      };
    })
  );

  return {
    signedIn: true,
    data: {
      title: stepFormFields.title,
      description: stepFormFields.description,
      position: stepFormFields.position,
      nextStepId: stepFormFields.nextStepId,
      previousStepId: stepFormFields.previousStepId,
      formFields: resultFields,
    },
  };
};

export default getApplicationFormStep;
