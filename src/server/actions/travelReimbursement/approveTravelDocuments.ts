"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";

type ApproveTravelDocumentsInput = {
  requestId: number;
};
const approveTravelDocuments = async ({
  requestId,
}: ApproveTravelDocumentsInput) => {
  await requireOrganizerSession();

  const toBePaidStatusId =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.approvedWaitingForPayment,
      },
    });

  if (!toBePaidStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  const {
    hacker: { hackathonId },
  } = await prisma.travelReimbursementRequest.update({
    data: {
      statusId: toBePaidStatusId.id,
    },
    where: {
      id: requestId,
    },
    select: {
      hacker: {
        select: {
          hackathonId: true,
        },
      },
    },
  });

  revalidatePath(`/dashboard/${hackathonId}/travel-reimbursements`, "page");
  revalidatePath("/application", "page");
};

export default approveTravelDocuments;
