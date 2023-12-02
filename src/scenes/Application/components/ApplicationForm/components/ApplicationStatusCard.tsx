import React from "react";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";

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
};
const ApplicationStatusCard = ({ status }: ApplicationStatusCardProps) => {
  return (
    <Card className="p-5 w-[95vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] md:mx-auto bg-primaryTitle">
      <Stack justify="center" alignItems="center" direction="column">
        <Text className="font-title font-semibold text-xl md:text-2xl text-white">
          Application status: {status}
        </Text>
        <Text className="text-white text-sm md:text-base">
          {ApplicationStatusDescriptions[status]}
        </Text>
      </Stack>
    </Card>
  );
};

export default ApplicationStatusCard;
