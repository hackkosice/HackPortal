"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HackathonData } from "@/server/getters/dashboard/hackathons";
import { useParams, usePathname, useRouter } from "next/navigation";

type HackathonSelectProps = {
  hackathons: HackathonData[];
};
const HackathonSelect = ({ hackathons }: HackathonSelectProps) => {
  const { push } = useRouter();
  const onSelect = (value: string) => {
    const pathSegment = pathName.split("/")[3] as string | undefined;
    if (pathSegment) {
      push(`/dashboard/${value}/${pathSegment}`);
      return;
    }
    push(`/dashboard/${value}`);
  };
  const params = useParams();
  const pathName = usePathname();
  return (
    <Select
      value={params.hackathonId as string | undefined}
      onValueChange={onSelect}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a hackathon" />
      </SelectTrigger>
      <SelectContent>
        {hackathons.map((hackathon) => (
          <SelectItem key={hackathon.id} value={String(hackathon.id)}>
            {hackathon.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default HackathonSelect;
