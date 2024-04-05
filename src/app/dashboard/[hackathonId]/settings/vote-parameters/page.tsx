import React from "react";
import { Metadata } from "next";
import VoteParameterManager from "@/scenes/Dashboard/scenes/VoteParameterManager/VoteParameterManager";
import requireAdmin from "@/services/helpers/requireAdmin";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Settings | Vote parameters",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  await requireAdmin();
  return <VoteParameterManager hackathonId={Number(hackathonId)} />;
};

export default Page;
