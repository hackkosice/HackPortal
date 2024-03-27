import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";
import { redirect } from "next/navigation";

const requireNonOrganizer = async (): Promise<void> => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.id,
    },
    select: {
      organizer: true,
      sponsor: {
        select: {
          id: true,
          hackathonId: true,
        },
      },
    },
  });

  if (user?.organizer) {
    if (!session.emailVerified) {
      redirect("/org-verify-email");
    }
    redirect("/dashboard");
  }

  if (user?.sponsor) {
    const sponsorHackathonId = user.sponsor.hackathonId;
    redirect(`/sponsors/${sponsorHackathonId}/applications`);
  }
};

export default requireNonOrganizer;
