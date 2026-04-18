import React from "react";
import { Metadata } from "next";
import requireAdmin from "@/services/helpers/requireAdmin";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";
import JudgingOverview from "@/scenes/Dashboard/scenes/Judging/scenes/JudgingOverview/JudgingOverview";
import getJudgingOverview from "@/server/getters/dashboard/judging/getJudgingOverview";

export const metadata: Metadata = {
  title: "Judging overview",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  await requireAdmin();
  const data = await getJudgingOverview(Number(hackathonId));
  return <JudgingOverview hackathonId={Number(hackathonId)} data={data} />;
};

export default Page;
