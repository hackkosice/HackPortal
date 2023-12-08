import React from "react";
import getTravelReimbursementsLists from "@/server/getters/dashboard/travelReimbursements/travelReimbursementsList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TravelReimbursementRequestTable from "@/scenes/Dashboard/scenes/TravelReimbursements/components/TravelReimbursementRequestTable";
import { Heading } from "@/components/ui/heading";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

type TravelReimbursementsListProps = {
  hackathonId: number;
};
const TravelReimbursementsList = async ({
  hackathonId,
}: TravelReimbursementsListProps) => {
  const {
    toReview,
    approved,
    documentUploaded,
    toBePaid,
    declined,
    paid,
    totalApprovedAmount,
    totalPaidAmount,
  } = await getTravelReimbursementsLists(hackathonId);
  return (
    <Card className="w-full md:w-[70vw] mx-auto">
      <CardHeader></CardHeader>
      <CardContent>
        <Stack direction="column" className="gap-10">
          <Stack direction="column">
            <Text size="large" weight="bold">
              Total approved amount for travel reimbursements:{" "}
              {new Intl.NumberFormat("sk-SK", {
                style: "currency",
                currency: "EUR",
              }).format(totalApprovedAmount)}
            </Text>
            <Text size="large" weight="bold">
              Total paid amount for travel reimbursements:{" "}
              {new Intl.NumberFormat("sk-SK", {
                style: "currency",
                currency: "EUR",
              }).format(totalPaidAmount)}
            </Text>
          </Stack>
          <Stack direction="column">
            <Heading size="small">
              Travel reimbursement requests to review
            </Heading>
            <TravelReimbursementRequestTable
              requests={toReview}
              actionType="review"
            />
          </Stack>
          <Stack direction="column">
            <Heading size="small">
              Approved Travel reimbursement requests
            </Heading>
            <TravelReimbursementRequestTable
              requests={approved}
              actionType="approved"
            />
          </Stack>
          <Stack direction="column">
            <Heading size="small">Travel documents to review</Heading>
            <TravelReimbursementRequestTable
              requests={documentUploaded}
              actionType="documentUploaded"
            />
          </Stack>
          <Stack direction="column">
            <Heading size="small">Reimbursement request to be paid</Heading>
            <TravelReimbursementRequestTable
              requests={toBePaid}
              actionType="toBePaid"
            />
          </Stack>
          <Stack direction="column">
            <Heading size="small">
              Declined Travel reimbursement requests
            </Heading>
            <TravelReimbursementRequestTable
              requests={declined}
              actionType="declined"
            />
          </Stack>
          <Stack direction="column">
            <Heading size="small">Paid Travel reimbursement requests</Heading>
            <TravelReimbursementRequestTable
              requests={paid}
              actionType="paid"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TravelReimbursementsList;
