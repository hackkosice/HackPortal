import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";

const requireOrganizerApp = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return false;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.id,
    },
    include: {
      organizer: true,
    },
  });

  return Boolean(user?.organizer);
};

export default requireOrganizerApp;
