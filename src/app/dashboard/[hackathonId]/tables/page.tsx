import React from "react";
import { Metadata } from "next";
import requireAdmin from "@/services/helpers/requireAdmin";
import TablesManager from "@/scenes/Dashboard/scenes/TablesManager/TablesManager";
import { disallowVolunteer } from "@/services/helpers/disallowVolunteer";

export const metadata: Metadata = {
  title: "Teams & Tables",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await disallowVolunteer(hackathonId);
  await requireAdmin();
  return <TablesManager hackathonId={Number(hackathonId)} />;
};

export default Page;
