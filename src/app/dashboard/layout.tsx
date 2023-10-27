import React from "react";
import DashboardLayoutComponent from "@/scenes/Dashboard/DashboardLayout";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayoutComponent>{children}</DashboardLayoutComponent>;
};

export default DashboardLayout;
