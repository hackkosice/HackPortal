"use server";

import { prisma } from "@/services/prisma";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import createKeyForReimbursementDocumentFileUpload from "@/server/services/helpers/fileUpload/createKeyForReimbursementDocumentFileUpload";
import { TravelReimbursementRequestStatusEnum } from "@/services/types/travelReimbursementRequestStatus";
import { revalidatePath } from "next/cache";

type UploadTravelReimbursementDetailsInput = {
  fileName: string;
  financialDetails: string;
};
const uploadTravelReimbursementDetails = async ({
  fileName,
  financialDetails,
}: UploadTravelReimbursementDetailsInput) => {
  if (financialDetails.length > 50) {
    throw new Error("Financial details too long");
  }

  const { id: hackerId } = await requireHackerSession();
  const travelReimbursementRequest =
    await prisma.travelReimbursementRequest.findUnique({
      select: {
        id: true,
        hacker: {
          select: {
            hackathonId: true,
          },
        },
      },
      where: {
        hackerId,
      },
    });
  if (!travelReimbursementRequest) {
    throw new Error("Travel reimbursement request not found");
  }

  const { id: fileId } = await prisma.file.create({
    select: {
      id: true,
    },
    data: {
      name: fileName,
      path: createKeyForReimbursementDocumentFileUpload({ hackerId }),
    },
  });

  const reviewDocumentsStatusId =
    await prisma.travelReimbursementRequestStatus.findUnique({
      where: {
        name: TravelReimbursementRequestStatusEnum.reviewDocuments,
      },
    });

  if (!reviewDocumentsStatusId) {
    throw new Error("Travel reimbursement request status not found");
  }

  await prisma.travelReimbursementRequest.update({
    where: {
      id: travelReimbursementRequest.id,
    },
    data: {
      statusId: reviewDocumentsStatusId.id,
      financialDetails,
      proofOfTravelFileId: fileId,
    },
  });

  revalidatePath(
    `/dashboard/${travelReimbursementRequest.hacker.hackathonId}/travel-reimbursements`,
    "page"
  );
  revalidatePath("/application", "page");
};

export default uploadTravelReimbursementDetails;
