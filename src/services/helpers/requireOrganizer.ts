import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireOrganizer = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/application");
  }

  const user = await prisma.user.findFirst({
    select: {
      organizer: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
    where: {
      id: session.id,
    },
  });

  if (!user) {
    redirect("/application");
  }

  if (!session.emailVerified) {
    redirect("/org-verify-email");
  }
};

export default requireOrganizer;
