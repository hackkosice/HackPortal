import React from "react";
import { trpc } from "@/services/trpc";
import DashboardOrganizer from "@/scenes/Dashboard/DashboardOrganizer/DashboardOrganizer";
import DashboardHacker from "@/scenes/Dashboard/DashboardHacker/DashboardHacker";

const Dashboard = () => {
  const { data } = trpc.userInfo.useQuery();
  const isOrganizer = Boolean(data?.data?.organizer);

  if (isOrganizer) {
    return <DashboardOrganizer />;
  }

  return <DashboardHacker />;
};

export default Dashboard;
