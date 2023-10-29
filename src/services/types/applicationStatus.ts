export const ApplicationStatusEnum = {
  open: "open",
  submitted: "submitted",
  invited: "invited",
  confirmed: "confirmed",
  declined: "declined",
} as const;

export type ApplicationStatus =
  (typeof ApplicationStatusEnum)[keyof typeof ApplicationStatusEnum];
