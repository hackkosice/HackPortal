"use client";

import React from "react";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Judge, Judges } from "@/server/getters/dashboard/judging/getJudges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JudgingManagerJudgeTimesheet from "@/scenes/Dashboard/scenes/Judging/scenes/JudgingManager/components/JudgingManagerJudgeTimesheet";
import { TeamForJudging } from "@/server/getters/dashboard/judging/getTeamsForJudging";

type JudgingManagerProps = {
  hackathonId: number;
  judges: Judges;
  teamsForJudging: TeamForJudging[];
};
const JudgingManager = ({
  hackathonId,
  judges: { judges },
  teamsForJudging,
}: JudgingManagerProps) => {
  const [selectedJudgeId, setSelectedJudgeId] = React.useState<number | null>(
    null
  );

  const onSelectJudge = (value: string) => {
    setSelectedJudgeId(Number(value));
  };
  return (
    <Stack direction="column" className="md:w-[70vw] mx-auto mb-20">
      <Link
        href={`/dashboard/${hackathonId}/judging`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to judging
        </Stack>
      </Link>
      <Card className="md:w-[70vw] px-5 py-3">
        <CardHeader>
          <CardTitle>Judging manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={onSelectJudge}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an organizer" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              {judges.map((judge) => (
                <SelectItem key={judge.id} value={String(judge.id)}>
                  {judge.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedJudgeId && (
            <JudgingManagerJudgeTimesheet
              judge={
                judges.find(
                  (judge) => judge.id === Number(selectedJudgeId)
                ) as Judge
              }
              teamsForJudging={teamsForJudging}
            />
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default JudgingManager;
