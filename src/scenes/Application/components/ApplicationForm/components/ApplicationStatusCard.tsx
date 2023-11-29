import React from "react";
import { ApplicationStatus } from "@/services/types/applicationStatus";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";

type ApplicationStatusCardProps = {
  status: ApplicationStatus;
};
const ApplicationStatusCard = ({ status }: ApplicationStatusCardProps) => {
  return (
    <Card className="p-5 w-[95vw] md:w-[30vw] md:mx-auto mb-5 bg-primaryTitle">
      <Stack justify="center" alignItems="center" direction="column">
        <Text className="font-title font-semibold text-xl md:text-2xl text-white">
          Application status: {status}
        </Text>
        <Text className="text-white text-sm md:text-base">
          Please fill in all of the required steps below.
        </Text>
      </Stack>
    </Card>
  );
};

export default ApplicationStatusCard;
