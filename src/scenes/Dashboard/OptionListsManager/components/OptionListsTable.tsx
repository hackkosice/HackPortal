"use client";
import React, { useState } from "react";
import {
  OptionList,
  OptionListsData,
} from "@/server/getters/dashboard/optionListManager/getOptionLists";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisHorizontalCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import NewOptionListDialog from "@/scenes/Dashboard/OptionListsManager/components/NewOptionListDialog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import deleteOptionList from "@/server/actions/dashboard/optionListManager/deleteOptionList";

type OptionListsTableProps = {
  optionLists: OptionListsData;
};

const ActionsCell = ({ optionList }: { optionList: OptionList }) => {
  const [
    isDeleteConfirmationDialogOpened,
    setIsDeleteConfirmationDialogOpened,
  ] = useState(false);
  const { id, name } = optionList;

  return (
    <>
      <ConfirmationDialog
        question={`Are you sure you want to delete option list "${name}"?`}
        onAnswer={async (answer) => {
          if (answer) {
            await deleteOptionList({ id });
          }
          setIsDeleteConfirmationDialogOpened(false);
        }}
        isManuallyOpened={isDeleteConfirmationDialogOpened}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalCircleIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild aria-label={`Edit option list ${name}`}>
            <Link href={`/dashboard/option-lists/${id}/edit`}>
              <PencilSquareIcon className="h-4 w-4 mr-1" />
              Edit list
            </Link>
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

const columns: ColumnDef<OptionList>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "optionsLength",
    header: "Number of options",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell optionList={row.original} />;
    },
  },
];
const OptionListsTable = ({ optionLists }: OptionListsTableProps) => {
  return (
    <>
      <Stack direction="column">
        <DataTable columns={columns} data={optionLists} />
        <NewOptionListDialog />
      </Stack>
    </>
  );
};

export default OptionListsTable;
