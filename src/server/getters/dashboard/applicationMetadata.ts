import { ApplicationStatus } from "@/services/types/applicationStatus";
import { prisma } from "@/services/prisma";
import calculateApplicationScore, {
  ApplicationScore,
} from "@/server/services/helpers/applications/calculateApplicationScore";

type ApplicationMetadataData = {
  hackerId: number;
  hackerEmail: string;
  status: ApplicationStatus;
  score: ApplicationScore;
};

const getApplicationMetadata = async (
  applicationId: number
): Promise<ApplicationMetadataData> => {
  const application = await prisma.application.findUnique({
    select: {
      hacker: {
        select: {
          id: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
      status: {
        select: {
          name: true,
        },
      },
      votes: {
        select: {
          voteParameter: {
            select: {
              weight: true,
            },
          },
          organizerId: true,
          value: true,
        },
      },
    },
    where: {
      id: applicationId,
    },
  });
  if (!application) {
    throw new Error("Application not found");
  }
  const score = calculateApplicationScore({ votes: application.votes });
  return {
    hackerId: application.hacker.id,
    hackerEmail: application.hacker.user.email,
    status: application.status.name as ApplicationStatus,
    score,
  };
};

export default getApplicationMetadata;
