"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";
import { sendDeclinedReimbursementEmail } from "@/services/emails/sendEmail";

type ApproveTravelReimbursementRequestInput = {
  requestId: number;
};
const declineTravelReimbursementRequest = async ({
  requestId,
}: ApproveTravelReimbursementRequestInput) => {
  await requireOrganizerSession();

  const declinedStatusId =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.declined,
      },
    });

  if (!declinedStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  const {
    hacker: { hackathonId, user },
  } = await prisma.travelReimbursementRequest.update({
    data: {
      statusId: declinedStatusId.id,
    },
    where: {
      id: requestId,
    },
    select: {
      hacker: {
        select: {
          hackathonId: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  void sendDeclinedReimbursementEmail({
    recipientEmail: user.email,
  });

  revalidatePath(`/dashboard/${hackathonId}/travel-reimbursements`, "page");
  revalidatePath("/application", "page");
};

export default declineTravelReimbursementRequest;
