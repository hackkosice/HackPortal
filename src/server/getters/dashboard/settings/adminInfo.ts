import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { prisma } from "@/services/prisma";

type OrganizerInfo = {
  id: number;
  email: string;
  isCurrentUser: boolean;
};
export type GetAdminInfoData = {
  admins: OrganizerInfo[];
  nonAdmins: OrganizerInfo[];
};
const getAdminInfo = async (): Promise<GetAdminInfoData> => {
  const currentOrganizer = await requireAdminSession();
  const organizers = await prisma.organizer.findMany({
    select: {
      id: true,
      user: {
        select: {
          email: true,
        },
      },
      isAdmin: true,
    },
  });

  const admins: OrganizerInfo[] = [];
  const nonAdmins: OrganizerInfo[] = [];

  organizers.forEach((organizer) => {
    if (organizer.isAdmin) {
      admins.push({
        id: organizer.id,
        email: organizer.user.email,
        isCurrentUser: organizer.id === currentOrganizer.id,
      });
    } else {
      nonAdmins.push({
        id: organizer.id,
        email: organizer.user.email,
        isCurrentUser: organizer.id === currentOrganizer.id,
      });
    }
  });

  return {
    admins,
    nonAdmins,
  };
};

export default getAdminInfo;
