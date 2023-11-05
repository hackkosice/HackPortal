import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";

type GetApplicationIdForReviewData = {
  applicationId: number | null;
};
const getApplicationIdForReview = async (
  hackathonId: number
): Promise<GetApplicationIdForReviewData> => {
  const { id: organizerId, currentApplicationForReviewId } =
    await requireOrganizerSession();
  if (currentApplicationForReviewId) {
    return {
      applicationId: currentApplicationForReviewId,
    };
  }
  const applications = await prisma.application.findMany({
    select: {
      id: true,
      votes: {
        select: {
          id: true,
          organizerId: true,
        },
      },
      organizersReviewing: {
        select: {
          id: true,
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
        {
          status: {
            name: ApplicationStatusEnum.submitted,
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
        numberOfOrganizersReviewing: application.organizersReviewing.length,
        numberOfDistinctOrganizers,
      };
    })
    .sort(
      (a, b) => a.numberOfDistinctOrganizers - b.numberOfDistinctOrganizers
    );

  const minNumberOfDistinctOrganizers = res[0].numberOfDistinctOrganizers;
  const applicationsWithMinNumberOfDistinctOrganizers = res
    .filter(
      (application) =>
        application.numberOfDistinctOrganizers === minNumberOfDistinctOrganizers
    )
    .sort(
      (a, b) => a.numberOfOrganizersReviewing - b.numberOfOrganizersReviewing
    );

  const minNumberOfOrganizersReviewing =
    applicationsWithMinNumberOfDistinctOrganizers[0]
      .numberOfOrganizersReviewing;
  const selectedApplications =
    applicationsWithMinNumberOfDistinctOrganizers.filter(
      (application) =>
        application.numberOfOrganizersReviewing ===
        minNumberOfOrganizersReviewing
    );

  const randomIndex = Math.floor(Math.random() * selectedApplications.length);
  const { id: selectedApplicationId } = selectedApplications[randomIndex];

  await prisma.organizer.update({
    where: {
      id: organizerId,
    },
    data: {
      currentApplicationForReviewId: selectedApplicationId,
    },
  });

  return {
    applicationId: selectedApplicationId,
  };
};

export default getApplicationIdForReview;
