import React from "react";
import { Metadata } from "next";
import VoteParameterManager from "@/scenes/Dashboard/scenes/VoteParameterManager/VoteParameterManager";
import requireAdmin from "@/services/helpers/requireAdmin";

export const metadata: Metadata = {
  title: "Settings | Vote parameters",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireAdmin();
  return <VoteParameterManager hackathonId={Number(hackathonId)} />;
};

export default Page;
