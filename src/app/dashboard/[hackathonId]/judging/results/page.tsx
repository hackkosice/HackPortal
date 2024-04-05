import React from "react";
import { Metadata } from "next";
import requireAdmin from "@/services/helpers/requireAdmin";
import JudgingResults from "@/scenes/Dashboard/scenes/Judging/scenes/JudgingResults/JudgingResults";

export const metadata: Metadata = {
  title: "Judging manager",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireAdmin();
  return <JudgingResults hackathonId={Number(hackathonId)} />;
};

export default Page;
