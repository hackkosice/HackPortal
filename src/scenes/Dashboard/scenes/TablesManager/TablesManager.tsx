import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import getConfirmedTeams, {
  TeamAndTable,
} from "@/server/getters/dashboard/tables/getConfirmedTeams";
import TeamRow from "@/scenes/Dashboard/scenes/TablesManager/components/TeamRow";
import getTableList from "@/server/getters/dashboard/tables/getTableList";
import NewTableDialog from "@/scenes/Dashboard/scenes/TablesManager/components/NewTableDialog";
import getChallengeList from "@/server/getters/dashboard/tables/getChallengeList";
import DownloadTablesTeam from "@/scenes/Dashboard/scenes/TablesManager/components/DownloadTablesTeam";

type TablesManagerProps = {
  hackathonId: number;
};
const sortTeamsByTableCodeCallback = (a: TeamAndTable, b: TeamAndTable) => {
  // Extract the letter and numeric parts of each string
  const tableCodeA = a.tableCode ?? "";
  const tableCodeB = b.tableCode ?? "";
  const matchA = tableCodeA.match(/([A-Z])(\d+)/);
  const matchB = tableCodeB.match(/([A-Z])(\d+)/);

  // If either team has no table code, sort it last
  if (!matchA) return 1;
  if (!matchB) return -1;

  // Extracted letter parts
  const letterA = matchA[1];
  const letterB = matchB[1];

  // Compare the letter parts
  if (letterA < letterB) return -1;
  if (letterA > letterB) return 1;

  // If letters are equal, convert numeric parts to numbers and compare them
  const numberA = parseInt(matchA[2], 10);
  const numberB = parseInt(matchB[2], 10);

  return numberA - numberB;
};
const TablesManager = async ({ hackathonId }: TablesManagerProps) => {
  const {
    fullyConfirmedTeams: fullyConfirmedTeamsUnsorted,
    partiallyConfirmedTeams,
  } = await getConfirmedTeams(hackathonId);
  const { tables } = await getTableList(hackathonId);
  const { challenges } = await getChallengeList(hackathonId);

  const fullyConfirmedTeams = fullyConfirmedTeamsUnsorted.sort(
    sortTeamsByTableCodeCallback
  );

  const dataForExport = fullyConfirmedTeams.map((team) => ({
    name: team.name,
    tableCode: team.tableCode ?? "NONE",
    challenges: team.challenges.map((challenge) => challenge.title).join(", "),
  }));
  return (
    <Card className="md:w-[70vw] mx-auto">
      <CardContent className="pt-5 mb-20">
        <div className="flex flex-row flex-wrap md:flex-nowrap">
          <div className="w-[90vw] lg:w-full">
            <div>
              <Heading size="small">
                Fully confirmed teams ({fullyConfirmedTeams.length})
              </Heading>
              <div className="flex flex-col gap-1">
                {fullyConfirmedTeams.map((team) => (
                  <TeamRow team={team} key={team.id} challenges={challenges} />
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
          <div className="pr-20">
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
        <DownloadTablesTeam data={dataForExport} />
      </CardContent>
    </Card>
  );
};

export default TablesManager;
