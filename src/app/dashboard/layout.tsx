import React from "react";
import DashboardLayoutComponent from "@/scenes/Dashboard/DashboardLayout";
import requireOrganizer from "@/services/helpers/requireOrganizer";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await requireOrganizer();
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
};

export default DashboardLayout;
