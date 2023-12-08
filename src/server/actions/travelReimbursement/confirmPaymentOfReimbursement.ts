"use server";

import { prisma } from "@/services/prisma";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import { revalidatePath } from "next/cache";

type ConfirmPaymentOfReimbursementInput = {
  requestId: number;
};
const confirmPaymentOfReimbursement = async ({
  requestId,
}: ConfirmPaymentOfReimbursementInput) => {
  await requireOrganizerSession();

  const paidStatusId = await prisma.travelReimbursementRequestStatus.findUnique(
    {
      where: {
        name: TravelReimbursementRequestStatusEnum.paid,
      },
    }
  );

  if (!paidStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  const {
    hacker: { hackathonId },
  } = await prisma.travelReimbursementRequest.update({
    data: {
      statusId: paidStatusId.id,
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

export default confirmPaymentOfReimbursement;
