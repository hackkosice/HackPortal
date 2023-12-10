import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { prisma } from "@/services/prisma";

type GetTravelReimbursementRequestDescriptionData = {
  description: string | null;
};
const getTravelReimbursementRequestDescription = async (
  hackathonId: number
): Promise<GetTravelReimbursementRequestDescriptionData> => {
  await requireOrganizerSession();
  const hackathon = await prisma.hackathon.findUnique({
    where: {
      id: hackathonId,
    },
    select: {
      travelReimbursementDescription: true,
    },
  });

  if (!hackathon) {
    throw new Error("Hackathon not found");
  }

  return {
    description: hackathon.travelReimbursementDescription,
  };
};

export default getTravelReimbursementRequestDescription;
