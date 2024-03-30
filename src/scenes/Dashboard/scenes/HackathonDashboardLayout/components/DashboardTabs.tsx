"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

type DashboardTabsProps = {
  hackathonId: number;
  isAdmin: boolean;
};

const getTabValue = (path: string, hackathonId: number) => {
  if (path === `/dashboard/${hackathonId}`) return "info";
  if (path.startsWith(`/dashboard/${hackathonId}/form-editor`)) return "form";
  if (path.startsWith(`/dashboard/${hackathonId}/applications`))
    return "applications";
  if (path.startsWith(`/dashboard/${hackathonId}/settings`)) return "settings";
  if (path.startsWith(`/dashboard/${hackathonId}/travel-reimbursements`))
    return "reimbursements";
  if (path.startsWith(`/dashboard/${hackathonId}/check-in`)) return "checkin";
  return undefined;
};

const DashboardTabs = ({ hackathonId, isAdmin }: DashboardTabsProps) => {
  const path = usePathname();
  const { push } = useRouter();

  const [tabValue, setTabValue] = React.useState<string | undefined>(
    getTabValue(path, hackathonId)
  );

  const onTabChange = (value: string) => {
    switch (value) {
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
        push(`/dashboard/${hackathonId}/hacker-tables`);
        break;
    }
  };

  useEffect(() => {
    setTabValue(getTabValue(path, hackathonId));
  }, [path, hackathonId]);

  return (
    <Tabs
      className={`w-full ${
        isAdmin ? "md:w-[80vw]" : "md:w-[50vw]"
      } h-fit my-5 mx-auto`}
      value={tabValue}
      onValueChange={onTabChange}
    >
      <TabsList
        className={`grid w-full grid-cols-2 ${
          isAdmin ? "md:grid-cols-6" : "md:grid-cols-3"
        } h-fit`}
      >
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="reimbursements">Travel reimbursements</TabsTrigger>
        <TabsTrigger value="checkin">Check-in</TabsTrigger>
        {isAdmin && <TabsTrigger value="form">Application form</TabsTrigger>}
        {isAdmin && <TabsTrigger value="info">Hackathon info</TabsTrigger>}
        {isAdmin && <TabsTrigger value="tables">Tables</TabsTrigger>}
        {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
