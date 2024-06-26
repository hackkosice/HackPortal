"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

type DashboardTabsProps = {
  hackathonId: number;
  isAdmin: boolean;
  isVolunteer: boolean;
};

type TabValue =
  | "info"
  | "form"
  | "applications"
  | "settings"
  | "reimbursements"
  | "checkin"
  | "tables"
  | "judging";

const getTabValue = (
  path: string,
  hackathonId: number
): TabValue | undefined => {
  if (path === `/dashboard/${hackathonId}`) return "info";
  if (path.startsWith(`/dashboard/${hackathonId}/form-editor`)) return "form";
  if (path.startsWith(`/dashboard/${hackathonId}/applications`))
    return "applications";
  if (path.startsWith(`/dashboard/${hackathonId}/settings`)) return "settings";
  if (path.startsWith(`/dashboard/${hackathonId}/travel-reimbursements`))
    return "reimbursements";
  if (path.startsWith(`/dashboard/${hackathonId}/check-in`)) return "checkin";
  if (path.startsWith(`/dashboard/${hackathonId}/tables`)) return "tables";
  if (path.startsWith(`/dashboard/${hackathonId}/judging`)) return "judging";
  return undefined;
};

const DashboardTabs = ({
  hackathonId,
  isAdmin,
  isVolunteer,
}: DashboardTabsProps) => {
  const path = usePathname();
  const { push } = useRouter();

  const [tabValue, setTabValue] = React.useState<string | undefined>(
    getTabValue(path, hackathonId)
  );

  const onTabChange = (value: string) => {
    switch (value as TabValue) {
      case "info":
        push(`/dashboard/${hackathonId}`);
        break;
      case "applications":
        push(`/dashboard/${hackathonId}/applications`);
        break;
      case "reimbursements":
        push(`/dashboard/${hackathonId}/travel-reimbursements`);
        break;
      case "form":
        push(`/dashboard/${hackathonId}/form-editor`);
        break;
      case "checkin":
        push(`/dashboard/${hackathonId}/check-in`);
        break;
      case "settings":
        push(`/dashboard/${hackathonId}/settings`);
        break;
      case "tables":
        push(`/dashboard/${hackathonId}/tables`);
        break;
      case "judging":
        push(`/dashboard/${hackathonId}/judging`);
        break;
    }
  };

  useEffect(() => {
    setTabValue(getTabValue(path, hackathonId));
  }, [path, hackathonId]);

  if (isVolunteer) return <div className="mt-5"></div>;

  return (
    <Tabs
      className={`w-full ${
        isAdmin ? "md:w-[90vw]" : "md:w-[50vw]"
      } h-fit my-5 mx-auto`}
      value={tabValue}
      onValueChange={onTabChange}
    >
      <TabsList
        className={`grid w-full grid-cols-2 ${
          isAdmin ? "md:grid-cols-8" : "md:grid-cols-3"
        } h-fit`}
      >
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="reimbursements">Travel reimbursements</TabsTrigger>
        <TabsTrigger value="checkin">Check-in</TabsTrigger>
        <TabsTrigger value="judging">Judging</TabsTrigger>
        {isAdmin && <TabsTrigger value="form">Application form</TabsTrigger>}
        {isAdmin && <TabsTrigger value="tables">Teams & Tables</TabsTrigger>}
        {isAdmin && <TabsTrigger value="info">Hackathon info</TabsTrigger>}
        {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
