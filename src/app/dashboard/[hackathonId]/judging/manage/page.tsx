import React from "react";
import { Metadata } from "next";
import requireAdmin from "@/services/helpers/requireAdmin";
import JudgingManager from "@/scenes/Dashboard/scenes/Judging/scenes/JudgingManager/JudgingManager";
import getJudges from "@/server/getters/dashboard/judging/getJudges";
import getTeamsForJudging from "@/server/getters/dashboard/judging/getTeamsForJudging";

export const metadata: Metadata = {
  title: "Judging manager",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireAdmin();
  const judges = await getJudges(Number(hackathonId));
  const teamsForJudging = await getTeamsForJudging(Number(hackathonId));
  return (
    <JudgingManager
      hackathonId={Number(hackathonId)}
      judges={judges}
      teamsForJudging={teamsForJudging}
    />
  );
};

export default Page;
