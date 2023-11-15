import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getFormFieldValue, {
  FormFieldValue,
} from "@/server/services/helpers/applications/getFormFieldValue";

export type PropertyValue = {
  label: string;
  value: FormFieldValue;
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
      step: {
        select: {
          id: true,
          title: true,
          position: true,
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
          values: [
            {
              label: formField.label,
              value: formFieldValue,
            },
          ],
        });
      } else {
        shownProperties[shownProperties.length - 1].values.push({
          label: formField.label,
          value: formFieldValue,
        });
      }
    } else {
      hiddenPropertiesValues.push({
        label: formField.label,
        value: formFieldValue,
      });
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
