import React from "react";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Dashboard from "@/scenes/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

const DashboardPage = async () => {
  if (!(await requireOrganizerApp())) {
    redirect("/application");
  }

  return <Dashboard />;
};

export default DashboardPage;
