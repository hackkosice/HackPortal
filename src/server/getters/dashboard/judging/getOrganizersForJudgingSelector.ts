import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

export type OrganizerForSelector = {
  id: number;
  name: string;
};

const getOrganizersForJudgingSelector = async (): Promise<
  OrganizerForSelector[]
> => {
  await requireAdminSession();

  const organizers = await prisma.organizer.findMany({
    select: {
      id: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return organizers.map((o) => ({
    id: o.id,
    name: o.user.name || o.user.email,
  }));
};

export default getOrganizersForJudgingSelector;
