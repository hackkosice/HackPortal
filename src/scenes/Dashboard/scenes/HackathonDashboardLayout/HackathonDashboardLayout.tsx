import React from "react";
import DashboardTabs from "@/scenes/Dashboard/scenes/HackathonDashboardLayout/components/DashboardTabs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type HackathonDashboardProps = {
  hackathonId: number;
  children?: React.ReactNode;
};
const HackathonDashboardLayout = async ({
  hackathonId,
  children,
}: HackathonDashboardProps) => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <DashboardTabs
        hackathonId={hackathonId}
        isAdmin={Boolean(session?.isAdmin)}
      />
      {children}
    </div>
  );
};

export default HackathonDashboardLayout;
