import React from "react";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";

type ApplicationDetailProps = {
  applicationId: number;
};
const ApplicationDetail = async ({ applicationId }: ApplicationDetailProps) => {
  const applicationDetail = await getApplicationDetail(applicationId);
  return (
    <Stack direction="column" spacing="small">
      {applicationDetail.properties.map((property) => (
        <Text key={property.stepTitle}>{property.stepTitle}</Text>
      ))}
    </Stack>
  );
};

export default ApplicationDetail;
