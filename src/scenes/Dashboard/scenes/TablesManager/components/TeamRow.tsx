import React from "react";
import { TeamAndTable } from "@/server/getters/dashboard/tables/getConfirmedTeams";
import AssignTableDialog from "@/scenes/Dashboard/scenes/TablesManager/components/AssignTableDialog";
import UnassignTableButton from "@/scenes/Dashboard/scenes/TablesManager/components/UnassignTableButton";
import AssignChallengeDialog from "@/scenes/Dashboard/scenes/TablesManager/components/AssignChallengeDialog";
import { Challenge } from "@/server/getters/dashboard/tables/getChallengeList";
import ChallengeCell from "@/scenes/Dashboard/scenes/TablesManager/components/ChallengeCell";

type TeamRowProps = {
  team: TeamAndTable;
  challenges: Challenge[];
};
const TeamRow = ({ team, challenges }: TeamRowProps) => {
  const canAssignChallenge = team.challenges.length < challenges.length;
  return (
    <div className="flex flex-row items-center">
      {team.name} ({team.memberCount}) - {team.tableCode ?? "No table"}{" "}
      {team.tableCode ? (
        <UnassignTableButton teamId={team.id} />
      ) : (
        <AssignTableDialog teamId={team.id} />
      )}
      {team.challenges.map((challenge) => (
        <ChallengeCell
          challenge={challenge}
          key={challenge.id}
          team={{
            id: team.id,
            name: team.name,
          }}
        />
      ))}
      {canAssignChallenge && (
        <AssignChallengeDialog
          teamId={team.id}
          challenges={challenges}
          filterChallengeIds={team.challenges.map((challenge) => challenge.id)}
        />
      )}
    </div>
  );
};

export default TeamRow;
