import React from "react";
import DashboardTabs from "@/scenes/Dashboard/scenes/HackathonDashboardLayout/components/DashboardTabs";

type HackathonDashboardProps = {
  hackathonId: number;
  children?: React.ReactNode;
};
const HackathonDashboardLayout = ({
  hackathonId,
  children,
}: HackathonDashboardProps) => {
  return (
    <div>
      <DashboardTabs hackathonId={hackathonId} />
      {children}
    </div>
  );
};

export default HackathonDashboardLayout;
