"use client";
import React, { useState } from "react";
import { OptionList } from "@/server/getters/dashboard/optionListManager/getOptionList";
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
  ArrowUpTrayIcon,
  EllipsisHorizontalCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Stack } from "@/components/ui/stack";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { OptionListOption } from "@/server/getters/dashboard/optionListManager/getOptionList";
import deleteOptions from "@/server/actions/dashboard/optionListManager/deleteOptions";
import EditOptionDialog from "@/scenes/Dashboard/scenes/OptionListsManager/scenes/OptionListEditor/components/EditOptionDialog";
import NewOptionDialog from "@/scenes/Dashboard/scenes/OptionListsManager/scenes/OptionListEditor/components/NewOptionDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import createNewOptions from "@/server/actions/dashboard/optionListManager/createNewOptions";
import { Checkbox } from "@/components/ui/checkbox";

type OptionListsTableProps = {
  optionList: OptionList;
};

const ActionsCell = ({ option }: { option: OptionListOption }) => {
  const [
    isDeleteConfirmationDialogOpened,
    setIsDeleteConfirmationDialogOpened,
  ] = useState(false);
  const [isEditOptionDialogOpened, setIsEditOptionDialogOpened] =
    useState(false);
  const { id, value } = option;

  return (
    <>
      <ConfirmationDialog
        question={`Are you sure you want to delete option "${value}"?`}
        onAnswer={async (answer) => {
          if (answer) {
            await deleteOptions({ optionIds: [id] });
          }
          setIsDeleteConfirmationDialogOpened(false);
        }}
        isManuallyOpened={isDeleteConfirmationDialogOpened}
      />
      <EditOptionDialog
        optionId={id}
        initialValue={value}
        isOpened={isEditOptionDialogOpened}
        onClose={() => {
          setIsEditOptionDialogOpened(false);
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label={`Open menu option ${value}`}
          >
            <span className="sr-only">Open menu</span>
            <EllipsisHorizontalCircleIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              setIsEditOptionDialogOpened(true);
            }}
          >
            <PencilSquareIcon className="h-4 w-4 mr-1" />
            Edit option
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

const columns: ColumnDef<OptionListOption>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-start">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "#",
    cell: ({ row }) => {
      return <span>{row.index + 1}</span>;
    },
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionsCell option={row.original} />;
    },
  },
];
const OptionsTable = ({
  optionList: { id, options },
}: OptionListsTableProps) => {
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // check if file is csv
    if (file.type !== "text/csv") {
      setFileUploadError("File must be in CSV format");
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    const response = await fetch(fileUrl);
    const text = await response.text();
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      setFileUploadError("No data found in the uploaded file");
      return;
    }

    await createNewOptions({
      optionListId: id,
      options: lines,
    });

    setFileUploadError(null);
  };

  const onDeleteSelectedClick = async (rowIndices: string[]) => {
    const optionIds = rowIndices
      .map((rowIndex) => {
        const row = options[parseInt(rowIndex)];
        return row.id;
      })
      .filter(Boolean);
    await deleteOptions({ optionIds });
  };
  return (
    <>
      <Stack direction="column" className="md:flex-row">
        <div className="md:w-[500px]">
          <DataTable
            columns={columns}
            data={options}
            shouldHaveFiltering
            filterColumn="value"
            hasRowSelection
            rowSelectionAction={(rowSelection) => (
              <Button
                size="small"
                variant="ghost"
                onClick={() => onDeleteSelectedClick(rowSelection)}
                className="text-red-500 hover:text-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete selected
              </Button>
            )}
          />
        </div>
        <Stack direction="column">
          <NewOptionDialog optionListId={id} />

          {fileUploadError && <Text type="error">{fileUploadError}</Text>}
          <Button size="small" asChild>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
              Upload options from file
            </Label>
          </Button>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={onFileUpload}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default OptionsTable;
