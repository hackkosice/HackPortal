import { FormFieldType, FormFieldTypeEnum } from "@/services/types/formFields";
import getFormFieldValue, {
  FormFieldValue,
} from "@/server/services/helpers/applications/getFormFieldValue";
import { prisma } from "@/services/prisma";
import getPresignedDownloadUrl from "@/services/fileUpload/getPresignedDownloadUrl";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;

export type PropertyValue = {
  label: string;
  type: FormFieldType;
  value: FormFieldValue;
  hasVisibilityRule: boolean;
  fileUrl?: string;
};

type StepProperties = {
  stepTitle: string;
  stepId: number;
  values: PropertyValue[];
};

export type ApplicationProperties = {
  shownProperties: StepProperties[];
  hiddenPropertiesValues: PropertyValue[];
};

type FormField = {
  shownInList: boolean;
  shownInSponsorsViewDetails: boolean;
  shownInSponsorsViewTable: boolean;
};

type Props = {
  applicationId: number;
  isShownFormFieldCallback: (formField: FormField) => boolean;
};

const getApplicationPropertiesForDisplay = async ({
  applicationId,
  isShownFormFieldCallback,
}: Props): Promise<ApplicationProperties> => {
  const application = await prisma.application.findUnique({
    select: {
      id: true,
      hacker: {
        select: {
          hackathonId: true,
        },
      },
      status: {
        select: {
          name: true,
        },
      },
      formValues: {
        select: {
          value: true,
          field: {
            select: {
              id: true,
            },
          },
          option: {
            select: {
              value: true,
            },
          },
          file: {
            select: {
              name: true,
              path: true,
            },
          },
        },
      },
    },
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const formFields = await prisma.formField.findMany({
    select: {
      id: true,
      label: true,
      shownInList: true,
      shownInSponsorsViewDetails: true,
      shownInSponsorsViewTable: true,
      type: {
        select: {
          value: true,
        },
      },
      step: {
        select: {
          id: true,
          title: true,
          position: true,
        },
      },
      formFieldVisibilityRule: {
        select: {
          id: true,
        },
      },
    },
    where: {
      step: {
        hackathonId: application.hacker.hackathonId,
      },
    },
    orderBy: [
      {
        step: {
          position: SortOrder.asc,
        },
      },
      {
        position: SortOrder.asc,
      },
    ],
  });

  const shownProperties: StepProperties[] = [];
  const hiddenPropertiesValues: PropertyValue[] = [];

  // Go over all form fields and if the field is shown in the list group it by step and add it to the shownProperties array
  // otherwise add it to the hiddenPropertiesValues array
  // Assumes that the formFields array is ordered by step and position
  for (const formField of formFields) {
    const formFieldValue = application.formValues.find(
      (formValue) => formValue.field.id === formField.id
    );
    if (!formFieldValue) {
      continue;
    }
    const formFieldValueData: PropertyValue = {
      label: formField.label,
      value: getFormFieldValue({ formValue: formFieldValue }),
      type: formField.type.value as FormFieldType,
      hasVisibilityRule: Boolean(formField.formFieldVisibilityRule),
      fileUrl:
        formField.type.value === FormFieldTypeEnum.file
          ? await getPresignedDownloadUrl(formFieldValue.file?.path as string)
          : undefined,
    };
    if (isShownFormFieldCallback(formField)) {
      const stepId = formField.step.id;
      const lastStepId =
        shownProperties.length > 0
          ? shownProperties[shownProperties.length - 1]?.stepId
          : null;
      if (lastStepId !== stepId) {
        shownProperties.push({
          stepTitle: formField.step.title,
          stepId: stepId,
          values: [formFieldValueData],
        });
      } else {
        shownProperties[shownProperties.length - 1].values.push(
          formFieldValueData
        );
      }
    } else {
      hiddenPropertiesValues.push(formFieldValueData);
    }
  }

  return {
    shownProperties,
    hiddenPropertiesValues,
  };
};

export default getApplicationPropertiesForDisplay;
