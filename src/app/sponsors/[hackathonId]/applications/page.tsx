import React from "react";
import { Metadata } from "next";
import SponsorsApplicationList from "@/scenes/Sponsors/ApplicationList/SponsorsApplicationList";
import requireSponsor from "@/services/helpers/requireSponsor";

export const metadata: Metadata = {
  title: "Sponsor Portal",
};

const SponsorApplicationPage = async ({
  params: { hackathonId },
}: {
  params: {
    hackathonId: string;
  };
}) => {
  await requireSponsor(Number(hackathonId));

  return <SponsorsApplicationList hackathonId={Number(hackathonId)} />;
};

export default SponsorApplicationPage;
