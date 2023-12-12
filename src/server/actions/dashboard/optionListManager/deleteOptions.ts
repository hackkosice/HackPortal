"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

type DeleteOptionsInput = {
  optionIds: number[];
};
const deleteOptions = async ({ optionIds }: DeleteOptionsInput) => {
  await requireAdminSession();

  const optionListIds = await prisma.option.findMany({
    select: {
      listId: true,
    },
    where: {
      id: {
        in: optionIds,
      },
    },
  });
  await prisma.$transaction(
    optionIds.map((optionId) =>
      prisma.option.delete({
        where: {
          id: optionId,
        },
      })
    )
  );

  optionListIds.map((optionListId) => {
    revalidatePath(`/option-lists/${optionListId}/edit`, "page");
  });
  revalidatePath("/option-lists", "page");
};

export default deleteOptions;
