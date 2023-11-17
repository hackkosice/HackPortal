"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type EditFormFieldInput = {
  formFieldId: number;
  label: string;
  name: string;
  typeId: number;
  required: boolean;
  optionListId?: number;
  newOptionListName?: string;
  description?: string;
  shouldBeShownInList?: boolean;
  visibilityRule?: {
    targetId: number;
    optionId: number;
  };
};

const editFormField = async ({
  formFieldId,
  typeId,
  label,
  name,
  required,
  optionListId,
  newOptionListName,
  shouldBeShownInList,
  description,
  visibilityRule,
}: EditFormFieldInput) => {
  await requireOrganizerSession();

  let newOptionListId: number | null = null;
  if (newOptionListName) {
    const { id } = await prisma.optionList.create({
      data: {
        name: newOptionListName,
      },
      select: {
        id: true,
      },
    });
    newOptionListId = id;
  }

  const {
    step: { id: stepId, hackathonId },
  } = await prisma.formField.update({
    where: {
      id: formFieldId,
    },
    data: {
      typeId,
      label,
      description,
      name,
      required,
      optionListId: newOptionListId ?? optionListId,
      shownInList: shouldBeShownInList,
    },
    select: {
      step: {
        select: {
          id: true,
          hackathonId: true,
        },
      },
    },
  });

  const existingVisibilityRule =
    await prisma.formFieldVisibilityRule.findUnique({
      where: {
        formFieldId,
      },
    });

  if (existingVisibilityRule && !visibilityRule) {
    await prisma.formFieldVisibilityRule.delete({
      where: {
        formFieldId,
      },
    });
  } else if (visibilityRule) {
    await prisma.formFieldVisibilityRule.upsert({
      where: {
        formFieldId,
      },
      update: {
        targetFormFieldId: visibilityRule.targetId,
        targetOptionId: visibilityRule.optionId,
      },
      create: {
        formFieldId,
        targetFormFieldId: visibilityRule.targetId,
        targetOptionId: visibilityRule.optionId,
      },
    });
  }

  revalidatePath(
    `/dashboard/${hackathonId}/form-editor/step/${stepId}/edit`,
    "page"
  );
  revalidatePath("/application", "page");
  revalidatePath(`/application/form/step/${stepId}`, "page");
};

export default editFormField;
