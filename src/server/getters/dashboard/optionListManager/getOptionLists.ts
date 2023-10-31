import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

export type OptionList = {
  id: number;
  name: string;
  optionsLength: number;
};
export type OptionListsData = OptionList[];
const getOptionLists = async (): Promise<OptionListsData> => {
  await requireOrganizerSession();

  const optionLists = await prisma.optionList.findMany({
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
  });
  return optionLists.map((optionList) => ({
    id: optionList.id,
    name: optionList.name,
    optionsLength: optionList.options.length,
  }));
};

export default getOptionLists;
