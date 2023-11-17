import React from "react";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";
import { Text } from "@/components/ui/text";
import { Stack } from "@/components/ui/stack";
import { Heading } from "@/components/ui/heading";
import HiddenPropertiesCollapsible from "@/scenes/Dashboard/scenes/ApplicationDetail/components/components/HiddenPropertiesCollapsible";
import { FormFieldTypeEnum } from "@/services/types/formFields";

type ApplicationDetailProps = {
  applicationId: number;
};
const ApplicationDetail = async ({ applicationId }: ApplicationDetailProps) => {
  const applicationDetail = await getApplicationDetail(applicationId);
  return (
    <Stack direction="column" spacing="small">
      {applicationDetail.shownProperties.map((property) => (
        <>
          <Heading key={property.stepId} size="small">
            {property.stepTitle}
          </Heading>
          {property.values.map(({ label, value, type, hasVisibilityRule }) => {
            if (hasVisibilityRule && !value) return null;
            if (type === FormFieldTypeEnum.textarea) {
              return (
                <Text key={value}>
                  <span className="font-bold">{label}</span>:<br />
                  {value}
                </Text>
              );
            }
            return (
              <Text key={value}>
                <span className="font-bold">{label}</span>: {value}
              </Text>
            );
          })}
        </>
      ))}
      <HiddenPropertiesCollapsible
        hiddenPropertiesValues={applicationDetail.hiddenPropertiesValues}
      />
    </Stack>
  );
};

export default ApplicationDetail;
