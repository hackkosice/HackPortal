"use server";

import { prisma } from "@/services/prisma";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";

type RejectTravelDocumentsInput = {
  requestId: number;
};
const rejectTravelDocuments = async ({
  requestId,
}: RejectTravelDocumentsInput) => {
  await requireOrganizerSession();

  const uploadDocumentsStatus =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.approvedWaitingForDocument,
      },
    });

  if (!uploadDocumentsStatus) {
    throw new Error("Travel reimbursement request status not found");
  }

  const {
    hacker: { hackathonId },
  } = await prisma.travelReimbursementRequest.update({
    data: {
      statusId: uploadDocumentsStatus.id,
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

export default rejectTravelDocuments;
