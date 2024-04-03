import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import getConfirmedTeams from "@/server/getters/dashboard/tables/getConfirmedTeams";
import TeamRow from "@/scenes/Dashboard/scenes/TablesManager/components/TeamRow";
import getTableList from "@/server/getters/dashboard/tables/getTableList";
import NewTableDialog from "@/scenes/Dashboard/scenes/TablesManager/components/NewTableDialog";

type TablesManagerProps = {
  hackathonId: number;
};
const TablesManager = async ({ hackathonId }: TablesManagerProps) => {
  const { fullyConfirmedTeams, partiallyConfirmedTeams } =
    await getConfirmedTeams(hackathonId);
  const { tables } = await getTableList(hackathonId);
  return (
    <Card className="md:w-[70vw] mx-auto">
      <CardContent className="pt-5">
        <div className="flex flex-row">
          <div className="w-full">
            <div>
              <Heading size="small">
                Fully confirmed teams ({fullyConfirmedTeams.length})
              </Heading>
              <div className="flex flex-col gap-1">
                {fullyConfirmedTeams.map((team) => (
                  <TeamRow team={team} key={team.id} />
                ))}
              </div>
            </div>
            <div className="mt-5">
              <Heading size="small">
                Partially confirmed teams ({partiallyConfirmedTeams.length})
              </Heading>
              <ul>
                {partiallyConfirmedTeams.map((team) => (
                  <li key={team.name}>{team.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full">
            <Heading size="small">Tables</Heading>
            <NewTableDialog hackathonId={hackathonId} mode="create" />
            <div className="flex flex-col mt-3 gap-1">
              {tables.map((table) => (
                <div key={table.code}>
                  {table.code} - {table.teamCount}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TablesManager;
