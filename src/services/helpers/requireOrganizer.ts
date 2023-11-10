import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireOrganizer = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/application");
  }

  if (!session.emailVerified) {
    redirect("/org-verify-email");
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

export default requireOrganizer;
