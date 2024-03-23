import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getActiveHackathonId from "@/server/getters/getActiveHackathonId";
import { prisma } from "@/services/prisma";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import getLastActiveHackathonId from "@/server/getters/getLastActiveHackathonId";

export type HackerFromSessionData = {
  closedPortal: boolean;
  hackathonId: number | null;
  hackerId: number | null;
  applicationId: number | null;
  signedIn: boolean;
  emailVerified: boolean | null;
  redirectToOrganizer: boolean;
};

/**
 * Retrieves the hacker data for the active hackathon from the current session.
 * @returns {Promise<HackerFromSessionData>} - The hacker data from the session.
 */
const getHackerForActiveHackathonFromSession =
  async (): Promise<HackerFromSessionData> => {
    // Fetch the session data from the server
    const session = await getServerSession(authOptions);

    // Get the active hackathon ID
    const activeHackathonId = await getActiveHackathonId(prisma);

    // Get the last active hackathon ID
    const lastActiveHackathonId = await getLastActiveHackathonId(prisma);

    // Check if there are no active hackathons going on
    if (!activeHackathonId && !lastActiveHackathonId) {
      // Return portal as closed with no hackathon, hacker or application
      return {
        closedPortal: true,
        hackathonId: null,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    // Check if there is no session going on
    if (!session?.id) {
      // Retrieve the session
      return {
        closedPortal: !activeHackathonId,
        hackathonId: activeHackathonId ?? lastActiveHackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    // Fetch the user by ID
    const userId = session.id;
    const user = await prisma.user.findUnique({
      select: {
        email: true,
      },
      where: {
        id: userId,
      },
    });

    // Check if there is no user
    if (!user) {
      // Return portal as closed with no user
      return {
        closedPortal: !activeHackathonId,
        hackathonId: activeHackathonId ?? lastActiveHackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: false,
      };
    }

    // Get the email for the user
    const email = user.email;

    // Check if the user is an organiser
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
      // Create organiser if it doesn't exist and return RedirectToOrganizer as true
      if (!organizer) {
        await prisma.organizer.create({
          data: {
            userId,
          },
        });
      }
      return {
        closedPortal: !activeHackathonId,
        hackathonId: activeHackathonId ?? lastActiveHackathonId,
        hackerId: null,
        applicationId: null,
        signedIn: false,
        emailVerified: false,
        redirectToOrganizer: true,
      };
    }

    // Check if user is a hacker
    const hacker = await prisma.hacker.findFirst({
      select: {
        id: true,
      },
      where: {
        userId,
        hackathonId: activeHackathonId ?? lastActiveHackathonId!,
      },
    });

    let hackerId: number;
    let applicationId: number;

    // Instantiate hacker if there isn't one yet
    if (!hacker) {
      const newHacker = await prisma.hacker.create({
        select: {
          id: true,
        },
        data: {
          userId,
          hackathonId: activeHackathonId ?? lastActiveHackathonId!,
        },
      });
      hackerId = newHacker.id;
    } else {
      hackerId = hacker.id;
    }

    // Check if there is an application
    const application = await prisma.application.findFirst({
      select: {
        id: true,
      },
      where: {
        hackerId,
      },
    });

    // Create an application if it doesn't exist else fetch the existing application
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

    // Return the final session data
    return {
      closedPortal: !activeHackathonId,
      hackathonId: activeHackathonId ?? lastActiveHackathonId,
      hackerId,
      applicationId,
      signedIn: true,
      emailVerified: session.emailVerified,
      redirectToOrganizer: false,
    };
  };

export default getHackerForActiveHackathonFromSession;
