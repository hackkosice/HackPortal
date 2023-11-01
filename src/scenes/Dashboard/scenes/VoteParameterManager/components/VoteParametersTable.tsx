"use client";

import React, { useState } from "react";
import {
  VoteParameter,
  VoteParametersData,
} from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import deleteVoteParameter from "@/server/actions/dashboard/voteParameterManager/deleteVoteParameter";
import NewVoteParameterDialog from "@/scenes/Dashboard/scenes/VoteParameterManager/components/NewVoteParameterDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

const ActionsCell = ({ voteParameter }: { voteParameter: VoteParameter }) => {
  const [
    isDeleteConfirmationDialogOpened,
    setIsDeleteConfirmationDialogOpened,
  ] = useState(false);
  const [isEditVoteParameterDialogOpened, setIsEditVoteParameterDialogOpened] =
    useState(false);
  const { id, name, description, minValue, maxValue, weight } = voteParameter;

  return (
    <>
      <ConfirmationDialog
        question={`Are you sure you want to delete vote parameter "${name}"? It may contain some votes already!`}
        onAnswer={async (answer) => {
          if (answer) {
            await deleteVoteParameter({ voteParameterId: id });
          }
          setIsDeleteConfirmationDialogOpened(false);
        }}
        isManuallyOpened={isDeleteConfirmationDialogOpened}
      />
      <NewVoteParameterDialog
        isOpened={isEditVoteParameterDialogOpened}
        onOpenChange={setIsEditVoteParameterDialogOpened}
        mode="edit"
        voteParameterId={id}
        initialData={{
          name,
          description: description ?? undefined,
          minValue,
          maxValue,
          weight,
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={`Open menu ${name} vote parameter`}
          >
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalCircleIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setIsEditVoteParameterDialogOpened(true);
            }}
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            Edit vote parameter
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500"
            onClick={() => {
              setIsDeleteConfirmationDialogOpened(true);
            }}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const voteParameterColumns: ColumnDef<VoteParameter>[] = [
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
  {
    header: "Actions",
    cell: ({ row }) => <ActionsCell voteParameter={row.original} />,
  },
];

type VoteParametersTableProps = {
  voteParameters: VoteParametersData;
};

const VoteParametersTable = ({ voteParameters }: VoteParametersTableProps) => {
  return <DataTable columns={voteParameterColumns} data={voteParameters} />;
};

export default VoteParametersTable;
