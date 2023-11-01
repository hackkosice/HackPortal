import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

type GetApplicationIdForReviewData = {
  applicationId: number | null;
};
const getApplicationIdForReview = async (
  hackathonId: number
): Promise<GetApplicationIdForReviewData> => {
  const { id: organizerId } = await requireOrganizerSession();
  const applications = await prisma.application.findMany({
    select: {
      id: true,
      votes: {
        select: {
          id: true,
          organizerId: true,
        },
      },
    },
    where: {
      AND: [
        {
          hacker: {
            hackathonId,
          },
        },
        {
          votes: {
            none: {
              organizerId,
            },
          },
        },
      ],
    },
  });
  if (applications.length === 0) {
    return {
      applicationId: null,
    };
  }

  const res = applications
    .map((application) => {
      const votedOrganizerIds = application.votes.map(
        (vote) => vote.organizerId
      );
      const numberOfDistinctOrganizers = new Set(votedOrganizerIds).size;
      return {
        id: application.id,
        numberOfDistinctOrganizers,
      };
    })
    .sort(
      (a, b) => a.numberOfDistinctOrganizers - b.numberOfDistinctOrganizers
    );

  const minNumberOfDistinctOrganizers = res[0].numberOfDistinctOrganizers;
  const applicationsWithMinNumberOfDistinctOrganizers = res.filter(
    (application) =>
      application.numberOfDistinctOrganizers === minNumberOfDistinctOrganizers
  );

  const randomIndex = Math.floor(
    Math.random() * applicationsWithMinNumberOfDistinctOrganizers.length
  );
  const randomApplication =
    applicationsWithMinNumberOfDistinctOrganizers[randomIndex];

  return {
    applicationId: randomApplication.id,
  };
};

export default getApplicationIdForReview;
