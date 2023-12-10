"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";
import { sendApprovedReimbursementEmail } from "@/services/emails/sendEmail";

type ApproveTravelReimbursementRequestInput = {
  requestId: number;
  approvedAmount: number;
};
const approveTravelReimbursementRequest = async ({
  requestId,
  approvedAmount,
}: ApproveTravelReimbursementRequestInput) => {
  await requireOrganizerSession();

  const approvedStatusId =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.approvedWaitingForDocument,
      },
    });

  if (!approvedStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  const {
    hacker: { hackathonId, user },
  } = await prisma.travelReimbursementRequest.update({
    data: {
      statusId: approvedStatusId.id,
      approvedAmount,
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

  void sendApprovedReimbursementEmail({
    recipientEmail: user.email,
  });

  revalidatePath(`/dashboard/${hackathonId}/travel-reimbursements`, "page");
  revalidatePath("/application", "page");
};

export default approveTravelReimbursementRequest;
