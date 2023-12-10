"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";
import { sendSubmittedReimbursementEmail } from "@/services/emails/sendEmail";

type CreateTravelReimbursementRequestInput = {
  country: string;
};
const createTravelReimbursementRequest = async ({
  country,
}: CreateTravelReimbursementRequestInput) => {
  const { id: hackerId, hackathonId } = await requireHackerSession();
  const requestedStatusId =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.requested,
      },
    });

  if (!requestedStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  const { hacker } = await prisma.travelReimbursementRequest.create({
    data: {
      countryOfTravel: country,
      hackerId,
      statusId: requestedStatusId.id,
    },
    select: {
      hacker: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  void sendSubmittedReimbursementEmail({
    recipientEmail: hacker.user.email,
  });

  revalidatePath("/application");
  revalidatePath(
    `/dashboard/${hackathonId}/travel-reimbursement-requests`,
    "page"
  );
};

export default createTravelReimbursementRequest;
