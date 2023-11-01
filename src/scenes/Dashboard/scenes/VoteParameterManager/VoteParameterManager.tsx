import React from "react";
import getVoteParameters, {
  VoteParameter,
} from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewVoteParameterDialog from "@/scenes/Dashboard/scenes/VoteParameterManager/components/NewVoteParameterDialog";
import { Stack } from "@/components/ui/stack";

type VoteParameterManagerProps = {
  hackathonId: number;
};

const VoteParameterColumns: ColumnDef<VoteParameter>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Min value",
    accessorKey: "minValue",
  },
  {
    header: "Max value",
    accessorKey: "maxValue",
  },
  {
    header: "Weight",
    accessorKey: "weight",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
];
const VoteParameterManager = async ({
  hackathonId,
}: VoteParameterManagerProps) => {
  const voteParameters = await getVoteParameters(hackathonId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Vote parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <DataTable columns={VoteParameterColumns} data={voteParameters} />
          <NewVoteParameterDialog hackathonId={hackathonId} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VoteParameterManager;
