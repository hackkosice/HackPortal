import React from "react";
import getApplicationDetail from "@/server/getters/dashboard/applicationDetail";
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
          <table>
            <tbody>
              {property.values.map(
                ({ label, value, type, hasVisibilityRule, fileUrl }, index) => {
                  if (hasVisibilityRule && !value) return null;
                  const isLastRow = index === property.values.length - 1;
                  const content =
                    type === FormFieldTypeEnum.file ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        className="text-hkOrange underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    );
                  return (
                    <tr key={value} className={!isLastRow ? "border-b-2" : ""}>
                      <td className="font-bold max-w-[250px] pr-4 align-top">
                        {label}
                      </td>
                      <td className="align-top">{content}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </>
      ))}
      <HiddenPropertiesCollapsible
        hiddenPropertiesValues={applicationDetail.hiddenPropertiesValues}
      />
    </Stack>
  );
};

export default ApplicationDetail;
