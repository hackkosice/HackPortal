"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";

type CreateNewOptionsInput = {
  optionListId: number;
  options: string[];
};
const createNewOptions = async ({
  options,
  optionListId,
}: CreateNewOptionsInput) => {
  await requireAdminSession();

  await prisma.$transaction(
    options.map((option) =>
      prisma.option.create({
        data: {
          value: option,
          listId: optionListId,
        },
      })
    )
  );

  revalidatePath(`/option-lists/${optionListId}/edit`, "page");
  revalidatePath("/option-lists", "page");
};

export default createNewOptions;
