import { prisma } from "@/services/prisma";
import {
  TravelReimbursementRequestStatus,
  TravelReimbursementRequestStatusEnum,
} from "@/services/types/travelReimbursementRequestStatus";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getPresignedUploadUrl from "@/services/fileUpload/getPresignedUploadUrl";
import createKeyForReimbursementDocumentFileUpload from "@/server/services/helpers/fileUpload/createKeyForReimbursementDocumentFileUpload";

type TravelReimbursementRequestData = {
  status: "not_signed_in" | "success";
  travelReimbursementRequest: {
    status: TravelReimbursementRequestStatus | null;
    approvedAmount: number | null;
  } | null;
  fileUploadLink: string | null;
};

type TravelReimbursementRequestInput = {
  hackerId: number | null;
};

const getTravelReimbursementRequest = async ({
  hackerId,
}: TravelReimbursementRequestInput): Promise<TravelReimbursementRequestData> => {
  const session = await getServerSession(authOptions);
  if (!session?.id || !hackerId) {
    return {
      status: "not_signed_in",
      travelReimbursementRequest: null,
      fileUploadLink: null,
    };
  }
  const hacker = await prisma.hacker.findUnique({
    select: {
      id: true,
      travelReimbursementRequest: {
        select: {
          status: {
            select: {
              name: true,
            },
          },
          approvedAmount: true,
        },
      },
    },
    where: {
      id: hackerId,
    },
  });
  if (!hacker) {
    throw new Error("Hacker not found");
  }
  const travelReimbursementRequest = hacker.travelReimbursementRequest
    ? {
        status: hacker.travelReimbursementRequest.status
          .name as TravelReimbursementRequestStatus,
        approvedAmount: hacker.travelReimbursementRequest.approvedAmount,
      }
    : null;

  return {
    status: "success",
    travelReimbursementRequest,
    fileUploadLink:
      travelReimbursementRequest?.status ===
      TravelReimbursementRequestStatusEnum.approvedWaitingForDocument
        ? await getPresignedUploadUrl(
            createKeyForReimbursementDocumentFileUpload({
              hackerId: hackerId,
            })
          )
        : null,
  };
};

export default getTravelReimbursementRequest;
