import React from "react";
import DashboardLayoutComponent from "@/scenes/Dashboard/DashboardLayout";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireOrganizerApp();
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
};

export default DashboardLayout;
