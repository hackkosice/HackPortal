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
      {Object.keys(applicationDetail.values).map((key) => (
        <Text key={key}>
          <span className="font-bold mr-1">{key}:</span>
          {applicationDetail.values[key]}
        </Text>
      ))}
    </Stack>
  );
};

export default ApplicationDetail;
