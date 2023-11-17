import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getFormFieldValue, {
  FormFieldValue,
} from "@/server/services/helpers/applications/getFormFieldValue";
import { FormFieldType } from "@/services/types/formFields";

export type PropertyValue = {
  label: string;
  type: FormFieldType;
  value: FormFieldValue;
  hasVisibilityRule: boolean;
};

type StepProperties = {
  stepTitle: string;
  stepId: number;
  values: PropertyValue[];
};

export type ApplicationDetailData = {
  id: number;
  status: string;
  shownProperties: StepProperties[];
  hiddenPropertiesValues: PropertyValue[];
};

const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetailData> => {
  await requireOrganizerSession();

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
    const formFieldValue = getFormFieldValue({
      formValue: application.formValues.find(
        (formValue) => formValue.field.id === formField.id
      ),
    });
    const formFieldValueData: PropertyValue = {
      label: formField.label,
      value: formFieldValue,
      type: formField.type.value as FormFieldType,
      hasVisibilityRule: Boolean(formField.formFieldVisibilityRule),
    };
    if (formField.shownInList) {
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
    id: application.id,
    status: application.status.name,
    shownProperties: shownProperties,
    hiddenPropertiesValues: hiddenPropertiesValues,
  };
};

export default getApplicationDetail;
