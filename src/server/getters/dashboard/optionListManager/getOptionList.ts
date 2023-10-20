import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

export type OptionList = {
  id: number;
  name: string;
  options: { id: number; value: string }[];
};

export type GetOptionListInput = {
  id: number;
};
const getOptionList = async ({
  id,
}: GetOptionListInput): Promise<OptionList> => {
  await requireOrganizerSession();

  const optionList = await prisma.optionList.findUnique({
    select: {
      id: true,
      name: true,
      options: {
        select: {
          id: true,
          value: true,
        },
      },
    },
    where: {
      id,
    },
  });

  if (!optionList) {
    throw new Error("Option list not found");
  }

  return optionList;
};

export default getOptionList;
