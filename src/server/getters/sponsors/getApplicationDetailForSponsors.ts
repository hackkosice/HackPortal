import requireSponsorSession from "@/server/services/helpers/auth/requireSponsorSession";
import getApplicationPropertiesForDisplay, {
  ApplicationProperties,
} from "@/server/services/helpers/applications/getApplicationPropertiesForDisplay";

type ApplicationDetailSponsorData = {
  id: number;
} & ApplicationProperties;

const getApplicationDetailForSponsors = async (
  applicationId: number
): Promise<ApplicationDetailSponsorData> => {
  await requireSponsorSession();

  const { shownProperties, hiddenPropertiesValues } =
    await getApplicationPropertiesForDisplay({
      applicationId,
      isShownFormFieldCallback: (formField) =>
        formField.shownInSponsorsViewDetails,
    });

  return {
    id: applicationId,
    shownProperties,
    hiddenPropertiesValues,
  };
};

export default getApplicationDetailForSponsors;
