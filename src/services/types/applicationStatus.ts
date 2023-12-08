export const ApplicationStatusEnum = {
  open: "open",
  submitted: "submitted",
  invited: "invited",
  rejected: "rejected",
  confirmed: "confirmed",
  declined: "declined",
  attended: "attended",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatusEnum)[keyof typeof ApplicationStatusEnum];
