"use client";

import React, { useMemo } from "react";
import { TravelReimbursementRequest } from "@/server/getters/dashboard/travelReimbursements/travelReimbursementsList";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Stack } from "@/components/ui/stack";
import approveTravelReimbursementRequest from "@/server/actions/travelReimbursement/approveTravelReimbursementRequest";
import declineTravelReimbursementRequest from "@/server/actions/travelReimbursement/declineTravelReimbursementRequest";
import ReimbursementAmountDialog from "@/scenes/Dashboard/scenes/TravelReimbursements/components/ReimbursementAmountDialog";
import approveTravelDocuments from "@/server/actions/travelReimbursement/approveTravelDocuments";
import rejectTravelDocuments from "@/server/actions/travelReimbursement/rejectTravelDocuments";
import confirmPaymentOfReimbursement from "@/server/actions/travelReimbursement/confirmPaymentOfReimbursement";
import Link from "next/link";
import { useParams } from "next/navigation";

type ActionType =
  | "review"
  | "approved"
  | "declined"
  | "paid"
  | "documentUploaded"
  | "toBePaid";

type TravelReimbursementRequestReviewTableProps = {
  requests: TravelReimbursementRequest[];
  actionType: ActionType;
};
const ActionsCell = ({
  request,
  actionType,
}: {
  request: TravelReimbursementRequest;
  actionType: ActionType;
}) => {
  const [isAmountDialogOpened, setIsAmountDialogOpened] = React.useState(false);
  const onApproveClick = async (amount: number) => {
    await approveTravelReimbursementRequest({
      requestId: request.id,
      approvedAmount: amount,
    });
  };
  const onDeclineClick = async () => {
    await declineTravelReimbursementRequest({
      requestId: request.id,
    });
  };
  const onApproveDocumentClick = async () => {
    await approveTravelDocuments({
      requestId: request.id,
    });
  };
  const onRejectDocumentClick = async () => {
    await rejectTravelDocuments({
      requestId: request.id,
    });
  };
  const onConfirmAsPaidClick = async () => {
    await confirmPaymentOfReimbursement({
      requestId: request.id,
    });
  };
  switch (actionType) {
    case "review":
      return (
        <>
          <ReimbursementAmountDialog
            isOpened={isAmountDialogOpened}
            onOpenChange={setIsAmountDialogOpened}
            onClose={onApproveClick}
            country={request.countryOfTravel}
          />
          <Stack>
            <Button
              className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-600"
              size="small"
              onClick={() => setIsAmountDialogOpened(true)}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-600"
              size="small"
              onClick={onDeclineClick}
            >
              <XCircleIcon className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </Stack>
        </>
      );
    case "documentUploaded":
      return (
        <Stack>
          <Button
            className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-600"
            size="small"
            onClick={onApproveDocumentClick}
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-600"
            size="small"
            onClick={onRejectDocumentClick}
          >
            <XCircleIcon className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </Stack>
      );
    case "toBePaid":
      return (
        <Button
          className="bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-600"
          size="small"
          onClick={onConfirmAsPaidClick}
        >
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Confirm as paid
        </Button>
      );
    default:
      return null;
  }
};
const TravelReimbursementRequestTable = ({
  requests,
  actionType,
}: TravelReimbursementRequestReviewTableProps) => {
  const params = useParams();
  const columns = useMemo(
    () =>
      [
        {
          header: "Status",
          accessorKey: "status",
        },
        {
          header: "Hacker email",
          accessorKey: "hackerEmail",
        },
        {
          header: "Application Status",
          accessorKey: "applicationStatus",
        },
        {
          header: "Application",
          cell: ({ row }) => {
            return (
              <Link
                className="text-hkOrange"
                href={`/dashboard/${params.hackathonId}/applications/${row.original.applicationId}/detail`}
              >
                Detail
              </Link>
            );
          },
        },
        {
          header: "Country",
          accessorKey: "countryOfTravel",
        },
        {
          header: "Amount",
          cell: ({ row }) => {
            return (
              <div>
                {row.original.approvedAmount
                  ? new Intl.NumberFormat("sk-SK", {
                      style: "currency",
                      currency: "EUR",
                    }).format(row.original.approvedAmount)
                  : ""}
              </div>
            );
          },
        },
        {
          header: "Travel document",
          cell: ({ row }) => {
            const fileUrl = row.original.travelDocumentFileLink;
            if (fileUrl) {
              return (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-hkOrange"
                >
                  View document
                </a>
              );
            }
            return null;
          },
        },
        {
          header: "Financial details",
          accessorKey: "financialDetails",
        },
        {
          header: "Actions",
          cell: ({ row }) => {
            return (
              <ActionsCell request={row.original} actionType={actionType} />
            );
          },
        },
      ] as ColumnDef<TravelReimbursementRequest>[],
    [params, actionType]
  );

  const totalAmount = useMemo(
    () =>
      requests.reduce(
        (accum, request) => accum + (request.approvedAmount ?? 0),
        0
      ),
    [requests]
  );

  return (
    <>
      <p>
        Total Amount:{" "}
        {new Intl.NumberFormat("sk-SK", {
          style: "currency",
          currency: "EUR",
        }).format(totalAmount)}
      </p>
      <DataTable columns={columns} data={requests} />
    </>
  );
};

export default TravelReimbursementRequestTable;
