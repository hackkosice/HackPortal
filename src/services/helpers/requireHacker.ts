import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireHacker = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/application");
  }

  const user = await prisma.user.findFirst({
    select: {
      hacker: true,
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
    redirect("/application");
  }

  if (!user.hacker) {
    redirect("/application");
  }
};

export default requireHacker;
