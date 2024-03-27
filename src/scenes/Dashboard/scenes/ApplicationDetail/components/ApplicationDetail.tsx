import React from "react";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";
import ApplicationDetailProperties from "@/scenes/Dashboard/scenes/ApplicationDetail/components/ApplicationDetailProperties";

type ApplicationDetailProps = {
  applicationId: number;
};
const ApplicationDetail = async ({ applicationId }: ApplicationDetailProps) => {
  const applicationDetail = await getApplicationDetail(applicationId);
  return (
    <ApplicationDetailProperties
      shownProperties={applicationDetail.shownProperties}
      hiddenPropertiesValues={applicationDetail.hiddenPropertiesValues}
    />
  );
};

export default ApplicationDetail;
