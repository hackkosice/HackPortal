import React from "react";
import { ApplicationProperties } from "@/server/services/helpers/applications/getApplicationPropertiesForDisplay";
import { Heading } from "@/components/ui/heading";
import { FormFieldTypeEnum } from "@/services/types/formFields";
import HiddenPropertiesCollapsible from "@/scenes/Dashboard/scenes/ApplicationDetail/components/HiddenPropertiesCollapsible";
import { Stack } from "@/components/ui/stack";

type ApplicationDetailPropertiesProps = ApplicationProperties;
const ApplicationDetailProperties = ({
  shownProperties,
  hiddenPropertiesValues,
}: ApplicationDetailPropertiesProps) => {
  return (
    <Stack direction="column" spacing="small">
      {shownProperties.map((property) => (
        <div key={property.stepId}>
          <Heading size="small">{property.stepTitle}</Heading>
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
                    <tr key={label} className={!isLastRow ? "border-b-2" : ""}>
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
        </div>
      ))}
      <HiddenPropertiesCollapsible
        hiddenPropertiesValues={hiddenPropertiesValues}
      />
    </Stack>
  );
};

export default ApplicationDetailProperties;
