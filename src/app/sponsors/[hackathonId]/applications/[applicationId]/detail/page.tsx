import SponsorsApplicationDetail from "@/scenes/Sponsors/ApplicationDetail/SponsorsApplicationDetail";
import requireSponsor from "@/services/helpers/requireSponsor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsor Portal",
};

const SponsorApplicationDetailPage = async ({
  params: { hackathonId, applicationId },
}: {
  params: {
    hackathonId: string;
    applicationId: string;
  };
}) => {
  await requireSponsor(Number(hackathonId));
  return (
    <SponsorsApplicationDetail
      applicationId={Number(applicationId)}
      hackathonId={Number(hackathonId)}
    />
  );
};

export default SponsorApplicationDetailPage;
