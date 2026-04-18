"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizerForSelector } from "@/server/getters/dashboard/judging/getOrganizersForJudgingSelector";

type JudgeSelectorProps = {
  organizers: OrganizerForSelector[];
  currentOrganizerId: number;
  basePath: string;
};

const JudgeSelector = ({
  organizers,
  currentOrganizerId,
  basePath,
}: JudgeSelectorProps) => {
  const router = useRouter();

  const onChange = (value: string) => {
    const url = new URL(basePath, window.location.origin);
    url.searchParams.set("forOrganizer", value);
    router.push(url.pathname + url.search);
  };

  return (
    <div className="mb-4">
      <p className="text-sm text-muted-foreground mb-1">Judging as:</p>
      <Select value={String(currentOrganizerId)} onValueChange={onChange}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {organizers.map((o) => (
            <SelectItem key={o.id} value={String(o.id)}>
              {o.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JudgeSelector;
