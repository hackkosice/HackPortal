import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireSponsor = async (hackathonId: number) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
    return;
  }

  const user = await prisma.user.findFirst({
    select: {
      sponsor: {
        select: {
          hackathonId: true,
        },
      },
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

  if (!user.sponsor) {
    redirect("/application");
    return;
  }

  if (user.sponsor.hackathonId !== hackathonId) {
    redirect(`/sponsors/${user.sponsor.hackathonId}/applications`);
    return;
  }
};

export default requireSponsor;
