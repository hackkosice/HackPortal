export const TravelReimbursementRequestStatusEnum = {
  requested: "requested",
  approvedWaitingForDocument: "approvedWaitingForDocument",
  reviewDocuments: "reviewDocuments",
  approvedWaitingForPayment: "approvedWaitingForPayment",
  paid: "paid",
  declined: "declined",
} as const;

export type TravelReimbursementRequestStatus =
  (typeof TravelReimbursementRequestStatusEnum)[keyof typeof TravelReimbursementRequestStatusEnum];
