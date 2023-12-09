import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/outline";
import getTravelReimbursementRequest from "@/server/getters/application/travelReimbursementRequest";
import {
  TravelReimbursementRequestStatus,
  TravelReimbursementRequestStatusEnum,
} from "@/services/types/travelReimbursementRequestStatus";
import RequestReimbursementButton from "@/scenes/Application/components/ReimbursementRequestManager/components/RequestReimbursementButton";
import UploadDetailsForReimbursementButton from "@/scenes/Application/components/ReimbursementRequestManager/components/UploadDetailsForReimbursementButton";

type ReimbursementRequestManagerProps = {
  hackerId: number | null;
};

const getContentMessage = (
  status: TravelReimbursementRequestStatus | null,
  approvedAmount: number | null
) => {
  switch (status) {
    case null:
      return "Travelling from abroad to our hackathon? We are so excited about that and we want to help you get here!";
    case TravelReimbursementRequestStatusEnum.requested:
      return "We have your reimbursement request. Please wait until we approve it.";
    case TravelReimbursementRequestStatusEnum.approvedWaitingForDocument:
      return `Your reimbursement request has been approved with amount ${new Intl.NumberFormat(
        "sk-SK",
        {
          style: "currency",
          currency: "EUR",
        }
      ).format(
        approvedAmount as number
      )}. Please upload your travel documents and financial details (such as IBAN), where the reimbursement will be paid out.`;
    case TravelReimbursementRequestStatusEnum.reviewDocuments:
      return "Your submitted info is being reviewed. Please wait until we review the documents and financial details.";
    case TravelReimbursementRequestStatusEnum.approvedWaitingForPayment:
      return "Your submitted documents have been approved. Please wait until we pay out your reimbursement.";
    case TravelReimbursementRequestStatusEnum.paid:
      return "Your reimbursement has been paid out. Thank you for your patience.";
    case TravelReimbursementRequestStatusEnum.declined:
      return "Unfortunately, we cannot approve your reimbursement request. If you have any questions, please contact us.";
  }
};

const ReimbursementRequestManager = async ({
  hackerId,
}: ReimbursementRequestManagerProps) => {
  const { status, travelReimbursementRequest, fileUploadLink } =
    await getTravelReimbursementRequest({ hackerId });
  return (
    <Card className="w-full p-5 relative pt-10">
      <GlobeEuropeAfricaIcon className="text-primaryTitle h-[100px] absolute opacity-20 top-[-50px] left-1/2 -translate-x-1/2" />
      <div className="z-10">
        <Heading size="medium" className="text-center">
          Your travel reimbursement
        </Heading>

        <Stack direction="column" alignItems="center" className="mt-5 gap-8">
          <Text>
            {getContentMessage(
              travelReimbursementRequest?.status ?? null,
              travelReimbursementRequest?.approvedAmount ?? null
            )}
          </Text>
          {travelReimbursementRequest === null && (
            <RequestReimbursementButton
              isSignedIn={status !== "not_signed_in"}
              hasEmailVerified={status === "success"}
            />
          )}
          {travelReimbursementRequest?.status ===
            TravelReimbursementRequestStatusEnum.approvedWaitingForDocument && (
            <UploadDetailsForReimbursementButton
              fileUploadUrl={fileUploadLink as string}
            />
          )}
        </Stack>
      </div>
    </Card>
  );
};

export default ReimbursementRequestManager;
