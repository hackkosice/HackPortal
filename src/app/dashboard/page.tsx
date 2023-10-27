import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Dashboard from "@/scenes/Dashboard/Dashboard";
import getHackathons from "@/server/getters/dashboard/hackathons";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }

  const { hackathons } = await getHackathons();
  if (hackathons.length > 0) {
    redirect(`/dashboard/${hackathons[0].id}/applications`);
  }

  return <Dashboard />;
};

export default DashboardPage;
