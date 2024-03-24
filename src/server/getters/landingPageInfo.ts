import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type LandingPageInfo = {
  title: string;
  description: string;
  ctaContent: string | null;
};
const getLandingPageInfo = async (): Promise<LandingPageInfo> => {
  let ctaContent = "Start application";
  const session = await getServerSession(authOptions);
  if (session?.id) {
    const userId = session.id;
    const organizer = await prisma.organizer.findUnique({
      where: {
        userId,
      },
    });
    if (organizer) {
      ctaContent = "Go to dashboard";
    } else {
      ctaContent = "Go to application";
    }
  }
  const hackathons = await prisma.hackathon.findMany();
  const today = new Date();
  for (const hackathon of hackathons) {
    if (
      hackathon.applicationStartDate < today &&
      hackathon.applicationEndDate > today
    ) {
      return {
        title:
          hackathon.title ??
          `Welcome to Application portal for ${hackathon.name}`,
        description: hackathon.description ?? "",
        ctaContent,
      };
    }
  }

  return {
    title: "Welcome to Application portal",
    description:
      "There is no open registration at the moment. Sign in to show your last applications.",
    ctaContent: ctaContent == "Start application" ? null : ctaContent,
  };
};

export default getLandingPageInfo;
