"use client";

import React from "react";
import { Challenge } from "@/server/getters/dashboard/tables/getChallengeList";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import callServerAction from "@/services/helpers/server/callServerAction";
import unassignTeamFromChallenge from "@/server/actions/dashboard/challenges/unassignTeamFromChallenge";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

type ChallengeCellProps = {
  challenge: Challenge;
  team: {
    id: number;
    name: string;
  };
};
const ChallengeCell = ({ challenge, team }: ChallengeCellProps) => {
  const onUnassignChallenge = async () => {
    await callServerAction(unassignTeamFromChallenge, {
      teamId: team.id,
      challengeId: challenge.id,
    });
  };
  return (
    <div className="flex flex-row items-center gap-1 border-2 px-1 mr-1">
      <span>{challenge.title}</span>
      <ConfirmationDialog
        onAnswer={async (value) => {
          if (value) {
            await onUnassignChallenge();
          }
        }}
        question={`Are you sure you want to unassign challenge ${challenge.title} from team ${team.name}?`}
      >
        <Button variant="ghost" className="text-red-500 p-0 h-fit">
          <X className="h-4 w-4" />
        </Button>
      </ConfirmationDialog>
    </div>
  );
};

export default ChallengeCell;
