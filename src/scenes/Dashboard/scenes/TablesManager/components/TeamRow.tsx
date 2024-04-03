import React from "react";
import { TeamAndTable } from "@/server/getters/dashboard/tables/getConfirmedTeams";
import AssignTableDialog from "@/scenes/Dashboard/scenes/TablesManager/components/AssignTableDialog";
import UnassignTableButton from "@/scenes/Dashboard/scenes/TablesManager/components/UnassignTableButton";

type TeamRowProps = {
  team: TeamAndTable;
};
const TeamRow = ({ team }: TeamRowProps) => {
  return (
    <div>
      {team.name} ({team.memberCount}) - {team.tableCode ?? "No table"}{" "}
      {team.challenges.length > 0 ? `- ${team.challenges.join(", ")}` : ""}
      {team.tableCode ? (
        <UnassignTableButton teamId={team.id} />
      ) : (
        <AssignTableDialog teamId={team.id} />
      )}
    </div>
  );
};

export default TeamRow;
