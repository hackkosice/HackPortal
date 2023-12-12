import React from "react";
import getHackathons from "@/server/getters/dashboard/hackathons";
import { Stack } from "@/components/ui/stack";
import { Heading } from "@/components/ui/heading";
import HackathonSelect from "@/scenes/Dashboard/components/HackathonSelect";
import NewHackathonDialog from "@/scenes/Dashboard/components/NewHackathonDialog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const { hackathons } = await getHackathons();
  const session = (await getServerSession(authOptions)) as Session;
  return (
    <div className="mx-auto mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset w-full md:min-w-[75%]">
      <Stack
        direction="column"
        className="md:flex-row md:justify-between md:items-center md:mx-20"
      >
        <Heading>Dashboard</Heading>
        <Stack direction="column" className="md:flex-row md:items-center">
          {session.isAdmin && <NewHackathonDialog />}
          {hackathons.length > 0 && <HackathonSelect hackathons={hackathons} />}
        </Stack>
      </Stack>
      {children}
    </div>
  );
};

export default DashboardLayout;
