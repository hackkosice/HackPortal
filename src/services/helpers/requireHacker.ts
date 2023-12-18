import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireHacker = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/application");
    return;
  }

  const user = await prisma.user.findFirst({
    select: {
      hacker: true,
    },
    where: {
      id: session.id,
    },
  });

  if (!user) {
    redirect("/application");
    return;
  }

  if (!session.emailVerified) {
    redirect("/application");
    return;
  }

  if (!user.hacker) {
    redirect("/application");
    return;
  }
};

export default requireHacker;
