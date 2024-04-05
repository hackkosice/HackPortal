import React from "react";
import { Metadata } from "next";
import requireOrganizer from "@/services/helpers/requireOrganizer";
import Judging from "@/scenes/Dashboard/scenes/Judging/Judging";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Judging",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  await requireOrganizer();
  return <Judging hackathonId={Number(hackathonId)} />;
};

export default Page;
