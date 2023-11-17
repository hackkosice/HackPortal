"use server";

import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type NewFormFieldInput = {
  stepId: number;
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

const createNewFormField = async ({
  stepId,
  typeId,
  label,
  name,
  required,
  optionListId,
  newOptionListName,
  description,
  shouldBeShownInList,
  visibilityRule,
}: NewFormFieldInput) => {
  await requireOrganizerSession();

  const lastFormField = await prisma.formField.findFirst({
    where: {
      stepId,
    },
    orderBy: {
      position: SortOrder.desc,
    },
  });

  const newFormFieldNumber = (lastFormField?.position ?? 0) + 1;

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
    id: newFormFieldId,
    step: { hackathonId },
  } = await prisma.formField.create({
    data: {
      stepId,
      typeId,
      label,
      name,
      required,
      description,
      position: newFormFieldNumber,
      optionListId: newOptionListId ?? optionListId,
      shownInList: shouldBeShownInList,
    },
    select: {
      id: true,
      step: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  if (visibilityRule) {
    await prisma.formFieldVisibilityRule.create({
      data: {
        formFieldId: newFormFieldId,
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

export default createNewFormField;
