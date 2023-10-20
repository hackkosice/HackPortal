"use server";

import { prisma } from "@/services/prisma";
import { revalidatePath } from "next/cache";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

type CreateNewOptionsInput = {
  optionListId: number;
  options: string[];
};
const createNewOptions = async ({
  options,
  optionListId,
}: CreateNewOptionsInput) => {
  await requireOrganizerSession();

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

  revalidatePath(`/dashboard/option-lists/${optionListId}/edit`, "page");
  revalidatePath("/dashboard/option-lists", "page");
};

export default createNewOptions;
