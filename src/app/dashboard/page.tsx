import React from "react";
import requireOrganizer from "@/services/helpers/requireOrganizer";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Dashboard from "@/scenes/Dashboard/Dashboard";
import getHackathons from "@/server/getters/dashboard/hackathons";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  await requireOrganizer();

  const { hackathons } = await getHackathons();
  if (hackathons.length > 0) {
    redirect(`/dashboard/${hackathons[0].id}/applications`);
  }

  return <Dashboard />;
};

export default DashboardPage;
