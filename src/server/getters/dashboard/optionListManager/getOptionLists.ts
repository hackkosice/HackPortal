import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/requireOrganizerSession";

export type OptionList = {
  id: number;
  name: string;
  optionsLength: number;
  options: { id: number; value: string }[];
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
    ...optionList,
    optionsLength: optionList.options.length,
  }));
};

export default getOptionLists;
