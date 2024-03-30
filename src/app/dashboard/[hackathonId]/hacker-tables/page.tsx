import React from "react";
import getAllTableRows from "@/server/getters/dashboard/hackerTablesManager/getAllTableRows";
import { TableRow, HackerTable } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import addNewTableRow from "@/server/actions/dashboard/hackerTableManager/addNewTableRow";
import AddNewTableRowButton from "@/scenes/Dashboard/components/AddTableRow";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { DeleteIcon } from "lucide-react";

export const metadata = {
  title: "Hacker Tables",
};

const HackerTablesPage = async (props: { params: { hackathonId: string } }) => {
  const {
    params: { hackathonId },
  } = props;

  const tableRows: TableRow[] = await getAllTableRows(Number(hackathonId));

  return (
    <div>
      <h1>Hacker Tables</h1>
      <AddNewTableRowButton hackathonId={Number(hackathonId)} />
      {tableRows.map((row: TableRow) => (
        <div key={row.id} className="pt-5">
          <div className="flex items-center space-x-4">
            <h3>Row: </h3>
            <Button variant="outline">
              <DeleteIcon className="w-4 h-4 mr-1 text-hkOrange inline" />
              Remove Row
            </Button>
          </div>
          <Card className="flex">
            {row.HackerTables.map((table: HackerTable) => (
              <div
                key={table.id}
                className={`flex-1 bg-gray rounded shadow mr-${table.Space} px-2 py-3`}
              >
                <h3>{table.Name}</h3>
                {table.Team.map(
                  (
                    team: any // Loop through the Team array
                  ) => (
                    <h4 key={team.id}>{team.members.length}</h4> // Display team name, assuming team object structure has a field called `name`
                  )
                )}
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
};

export default HackerTablesPage;
