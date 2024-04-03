import React from "react";
import { Metadata } from "next";
import requireAdmin from "@/services/helpers/requireAdmin";
import TablesManager from "@/scenes/Dashboard/scenes/TablesManager/TablesManager";

export const metadata: Metadata = {
  title: "Checkin",
};

const Page = async ({
  params: { hackathonId },
}: {
  params: { hackathonId: string };
}) => {
  await requireAdmin();
  return <TablesManager hackathonId={Number(hackathonId)} />;
};

export default Page;
