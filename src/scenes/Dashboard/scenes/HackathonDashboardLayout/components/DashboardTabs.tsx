"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";

type DashboardTabsProps = {
  hackathonId: number;
};

const getTabValue = (path: string, hackathonId: number) => {
  if (path === `/dashboard/${hackathonId}`) return "info";
  if (path.startsWith(`/dashboard/${hackathonId}/form-editor`)) return "form";
  if (path.startsWith(`/dashboard/${hackathonId}/applications`))
    return "applications";
  if (path.startsWith(`/dashboard/${hackathonId}/settings`)) return "settings";
  return undefined;
};

const DashboardTabs = ({ hackathonId }: DashboardTabsProps) => {
  const path = usePathname();
  const { push } = useRouter();

  const onTabChange = (value: string) => {
    switch (value) {
      case "info":
        push(`/dashboard/${hackathonId}`);
        break;
      case "applications":
        push(`/dashboard/${hackathonId}/applications`);
        break;
      case "form":
        push(`/dashboard/${hackathonId}/form-editor`);
        break;
      case "settings":
        push(`/dashboard/${hackathonId}/settings`);
        break;
    }
  };

  return (
    <Tabs
      className="w-full md:w-[70%] h-fit my-5 mx-auto"
      defaultValue={getTabValue(path, hackathonId)}
      onValueChange={onTabChange}
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-fit">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="form">Application form</TabsTrigger>
        <TabsTrigger value="info">Hackathon info</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;