import React from "react";
import HackathonDashboardLayout from "@/scenes/Dashboard/scenes/HackathonDashboardLayout/HackathonDashboardLayout";

const HackathonDashboardPage = ({
  params: { hackathonId },
  children,
}: {
  params: { hackathonId: string };
  children: React.ReactNode;
}) => {
  return (
    <HackathonDashboardLayout hackathonId={Number(hackathonId)}>
      {children}
    </HackathonDashboardLayout>
  );
};

export default HackathonDashboardPage;
