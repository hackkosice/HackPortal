import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getApplicationPropertiesForDisplay, {
  ApplicationProperties,
} from "@/server/services/helpers/applications/getApplicationPropertiesForDisplay";

export type ApplicationDetailData = {
  id: number;
} & ApplicationProperties;

const getApplicationDetail = async (
  applicationId: number
): Promise<ApplicationDetailData> => {
  await requireOrganizerSession();

  const { shownProperties, hiddenPropertiesValues } =
    await getApplicationPropertiesForDisplay({
      applicationId,
      isShownFormFieldCallback: (formField) => formField.shownInList,
    });

  return {
    id: applicationId,
    shownProperties,
    hiddenPropertiesValues,
  };
};

export default getApplicationDetail;
