"use client";

import React from "react";
import { Judge } from "@/server/getters/dashboard/judging/getJudges";
import dateToTimeString from "@/services/helpers/dateToTimeString";
import NewTeamJudgingDialog from "@/scenes/Dashboard/scenes/Judging/scenes/JudgingManager/components/NewTeamJudgingDialog";
import { TeamForJudging } from "@/server/getters/dashboard/judging/getTeamsForJudging";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import callServerAction from "@/services/helpers/server/callServerAction";
import deleteTeamJudging from "@/server/actions/dashboard/judging/deleteTeamJudging";

type JudgingManagerJudgeTimesheetProps = {
  judge: Judge;
  teamsForJudging: TeamForJudging[];
};
const JudgingManagerJudgeTimesheet = ({
  judge,
  teamsForJudging,
}: JudgingManagerJudgeTimesheetProps) => {
  return (
    <div className="mt-5">
      {judge.teamJudgings.map((teamJudging) => (
        <div
          key={teamJudging.judgingSlot.id}
          className="flex flex-row items-center gap-1"
        >
          <span>
            {dateToTimeString(teamJudging.judgingSlot.startTime)} -{" "}
            {dateToTimeString(teamJudging.judgingSlot.endTime)}
          </span>
          {teamJudging.team ? (
            <>
              <span>{teamJudging.team.name}</span>
              {" - "}
              <span>{teamJudging.team.tableCode}</span>
              <ConfirmationDialog
                question="Are you sure you want to unassign this team?"
                onAnswer={async (answer) => {
                  if (answer) {
                    await callServerAction(deleteTeamJudging, {
                      teamJudgingId: teamJudging.team?.teamJudgingId as number,
                    });
                  }
                }}
              >
                <Button variant="ghost" className="text-red-500 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </ConfirmationDialog>
            </>
          ) : (
            <NewTeamJudgingDialog
              judgingSlotId={teamJudging.judgingSlot.id}
              organizerId={judge.id}
              teamOptions={teamsForJudging.map((team) => ({
                value: team.teamId.toString(),
                label: team.nameAndTable,
              }))}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default JudgingManagerJudgeTimesheet;
