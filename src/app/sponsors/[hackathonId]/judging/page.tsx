import React from "react";
import { Metadata } from "next";
import requireSponsor from "@/services/helpers/requireSponsor";
import SponsorJudging from "@/scenes/Sponsors/Judging/SponsorJudging";

export const metadata: Metadata = {
  title: "Sponsor Judging",
};

const SponsorJudgingPage = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireSponsor(Number(hackathonId));

  return <SponsorJudging hackathonId={Number(hackathonId)} />;
};

export default SponsorJudgingPage;
