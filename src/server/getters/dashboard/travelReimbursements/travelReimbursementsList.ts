import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import {
  TravelReimbursementRequestStatus,
  TravelReimbursementRequestStatusEnum,
} from "@/services/types/travelReimbursementRequestStatus";
import { prisma } from "@/services/prisma";
import TravelReimbursementRequest from "@/server/getters/application/travelReimbursementRequest";
import getPresignedDownloadUrl from "@/services/fileUpload/getPresignedDownloadUrl";
import { ApplicationStatus } from "@/services/types/applicationStatus";

export type TravelReimbursementRequest = {
  id: number;
  status: TravelReimbursementRequestStatus;
  hackerEmail: string;
  countryOfTravel: string;
  travelDocumentFileLink: string | null;
  approvedAmount: number | null;
  financialDetails: string | null;
  applicationStatus: ApplicationStatus;
  applicationId: number;
};

type TravelReimbursementRequestsLists = {
  toReview: TravelReimbursementRequest[];
  approved: TravelReimbursementRequest[];
  documentUploaded: TravelReimbursementRequest[];
  toBePaid: TravelReimbursementRequest[];
  declined: TravelReimbursementRequest[];
  paid: TravelReimbursementRequest[];
  totalApprovedAmount: number;
  totalPaidAmount: number;
};

const getTravelReimbursementsLists = async (
  hackathonId: number
): Promise<TravelReimbursementRequestsLists> => {
  await requireOrganizerSession();

  const travelReimbursementRequestsDb =
    await prisma.travelReimbursementRequest.findMany({
      select: {
        id: true,
        status: {
          select: {
            name: true,
          },
        },
        countryOfTravel: true,
        financialDetails: true,
        approvedAmount: true,
        hacker: {
          select: {
            user: {
              select: {
                email: true,
              },
            },
            application: {
              select: {
                status: {
                  select: {
                    name: true,
                  },
                },
                id: true,
              },
            },
          },
        },
        proofOfTravelFile: {
          select: {
            path: true,
          },
        },
      },
      where: {
        hacker: {
          hackathonId,
        },
      },
    });

  const travelReimbursementRequests: TravelReimbursementRequest[] =
    await Promise.all(
      travelReimbursementRequestsDb.map(async (request) => ({
        id: request.id,
        financialDetails: request.financialDetails,
        approvedAmount: request.approvedAmount,
        countryOfTravel: request.countryOfTravel,
        hackerEmail: request.hacker.user.email,
        travelDocumentFileLink: request.proofOfTravelFile?.path
          ? await getPresignedDownloadUrl(request.proofOfTravelFile.path)
          : null,
        status: request.status.name as TravelReimbursementRequestStatus,
        applicationStatus: request.hacker.application?.status
          .name as ApplicationStatus,
        applicationId: request.hacker.application?.id as number,
      }))
    );

  return {
    totalApprovedAmount: travelReimbursementRequests.reduce(
      (total, request) => total + (request.approvedAmount || 0),
      0
    ),
    totalPaidAmount: travelReimbursementRequests.reduce(
      (total, request) =>
        total +
        (request.status === TravelReimbursementRequestStatusEnum.paid
          ? request.approvedAmount || 0
          : 0),
      0
    ),
    toReview: travelReimbursementRequests.filter(
      (request) =>
        request.status === TravelReimbursementRequestStatusEnum.requested
    ),
    documentUploaded: travelReimbursementRequests.filter(
      (request) =>
        request.status === TravelReimbursementRequestStatusEnum.reviewDocuments
    ),
    approved: travelReimbursementRequests.filter(
      (request) =>
        request.status ===
        TravelReimbursementRequestStatusEnum.approvedWaitingForDocument
    ),
    toBePaid: travelReimbursementRequests.filter(
      (request) =>
        request.status ===
        TravelReimbursementRequestStatusEnum.approvedWaitingForPayment
    ),
    declined: travelReimbursementRequests.filter(
      (request) =>
        request.status === TravelReimbursementRequestStatusEnum.declined
    ),
    paid: travelReimbursementRequests.filter(
      (request) => request.status === TravelReimbursementRequestStatusEnum.paid
    ),
  };
};

export default getTravelReimbursementsLists;
