import React from "react";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import ConfirmAttendanceButton from "@/scenes/Application/components/ApplicationForm/components/ConfirmAttendanceButton";

type ApplicationStatusCardProps = {
  status: ApplicationStatus;
};
const ApplicationStatusDescriptions: { [key in ApplicationStatus]: string } = {
  [ApplicationStatusEnum.open]:
    "Please fill in all of the required steps below.",
  [ApplicationStatusEnum.submitted]:
    "Your application has been submitted. You can still join, create and manage your team. We will let you know about the results of the selection process.",
  [ApplicationStatusEnum.invited]:
    "Congratulations, You have been invited! Confirm your attendance by clicking the button below.",
  [ApplicationStatusEnum.confirmed]:
    "Your attendance is confirmed. We are looking forward to seeing you at the event!",
  [ApplicationStatusEnum.declined]:
    "We are sorry to hear that you cannot attend. We hope to see you next time!",
  [ApplicationStatusEnum.rejected]:
    "Unfortunately, we cannot accept your application. If you have any questions, please contact us.",
  [ApplicationStatusEnum.attended]:
    "Thank you for attending our event! We hope you had a great time.",
};

const ApplicationStatusEmojis: { [key in ApplicationStatus]: string | null } = {
  [ApplicationStatusEnum.open]: null,
  [ApplicationStatusEnum.submitted]: null,
  [ApplicationStatusEnum.invited]: "🎉",
  [ApplicationStatusEnum.confirmed]: "✅",
  [ApplicationStatusEnum.declined]: null,
  [ApplicationStatusEnum.rejected]: null,
  [ApplicationStatusEnum.attended]: "💪",
};
const ApplicationStatusCard = ({ status }: ApplicationStatusCardProps) => {
  return (
    <Card className="p-5 w-[95vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] md:mx-auto bg-primaryTitle">
      <Stack justify="center" alignItems="center" direction="column">
        <Text className="font-title font-semibold text-xl md:text-2xl text-white">
          {ApplicationStatusEmojis[status]} Application status: {status}{" "}
          {ApplicationStatusEmojis[status]}
        </Text>
        <Text className="text-white text-sm md:text-base">
          {ApplicationStatusDescriptions[status]}
        </Text>
        {status === ApplicationStatusEnum.invited && (
          <ConfirmAttendanceButton />
        )}
      </Stack>
    </Card>
  );
};

export default ApplicationStatusCard;
