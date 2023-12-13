import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

type HackerFromSessionData = {
  hackathonId: number | null;
  hackerId: number | null;
  applicationId: number | null;
  signedIn: boolean;
  emailVerified: boolean | null;
  redirectToOrganizer: boolean;
};

const getHackerForActiveHackathonFromSession =
  async (): Promise<HackerFromSessionData> => {
    const session = await getServerSession(authOptions);

    const hackathonId = await getActiveHackathonId(prisma);

    if (!hackathonId) {
      return {
        hackathonId: null,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    if (!session?.id) {
      return {
        hackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    const userId = session.id;
    const user = await prisma.user.findUnique({
      select: {
        email: true,
      },
      where: {
        id: userId,
      },
    });
    if (!user) {
      return {
        hackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    const email = user.email;

    if (
      email &&
      (email.endsWith("@hackkosice.com") || email.endsWith("@hackslovakia.com"))
    ) {
      const organizer = await prisma.organizer.findFirst({
        select: {
          id: true,
        },
        where: {
          userId,
        },
      });

      if (!organizer) {
        await prisma.organizer.create({
          data: {
            userId,
          },
        });
      }
      return {
        hackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: true,
      };
    }

    const hacker = await prisma.hacker.findFirst({
      select: {
        id: true,
      },
      where: {
        userId,
        hackathonId,
      },
    });

    let hackerId: number;
    let applicationId: number;

    if (!hacker) {
      const newHacker = await prisma.hacker.create({
        select: {
          id: true,
        },
        data: {
          userId,
          hackathonId,
        },
      });

      hackerId = newHacker.id;
    } else {
      hackerId = hacker.id;
    }

    const application = await prisma.application.findFirst({
      select: {
        id: true,
      },
      where: {
        hackerId,
      },
    });
    if (!application) {
      const { id: openStatusId } = (await prisma.applicationStatus.findFirst({
        select: {
          id: true,
        },
        where: {
          name: ApplicationStatusEnum.open,
        },
      })) as { id: number };
      const newApplication = await prisma.application.create({
        select: {
          id: true,
        },
        data: {
          hackerId,
          statusId: openStatusId,
        },
      });
      applicationId = newApplication.id;
    } else {
      applicationId = application.id;
    }

    return {
      hackathonId,
      hackerId,
      applicationId,
      signedIn: true,
      emailVerified: session.emailVerified,
      redirectToOrganizer: false,
    };
  };

export default getHackerForActiveHackathonFromSession;
