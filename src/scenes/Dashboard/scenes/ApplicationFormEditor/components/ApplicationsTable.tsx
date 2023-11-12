"use client";

import React, { useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ApplicationData } from "@/server/getters/dashboard/applicationList";
import { ApplicationFormValuesObject } from "@/server/services/helpers/applications/createFormValuesObject";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const ActionsCell = ({
  applicationValues,
}: {
  applicationValues: ApplicationFormValuesObject;
}) => {
  return (
    <Link
      href={`applications/${applicationValues.id}/detail`}
      className="text-hkOrange"
    >
      Details
    </Link>
  );
};

type ApplicationsTableProps = {
  hackathonId: number;
  applicationValues: ApplicationFormValuesObject[];
  applications: ApplicationData[];
};
const ApplicationsTable = ({
  hackathonId,
  applicationValues,
  applications,
}: ApplicationsTableProps) => {
  const columns: ColumnDef<ApplicationFormValuesObject>[] = useMemo(
    () => [
      ...Object.keys(applications[0].properties).map((key) => ({
        header: key,
        accessorKey: key,
      })),
      {
        id: "Actions",
        cell: ({ row }) => <ActionsCell applicationValues={row.original} />,
      },
    ],
    [applications]
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data: applicationValues,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  const saveColumnVisibility = (columnName: string, visibility: boolean) => {
    const oldColumnVisibility =
      localStorage.getItem(`hackathon-${hackathonId}-column-visibility`) ??
      "{}";
    const oldColumnVisibilityObject = JSON.parse(oldColumnVisibility);
    const newColumnVisibilityObject = {
      ...oldColumnVisibilityObject,
      [columnName]: visibility,
    };
    localStorage.setItem(
      `hackathon-${hackathonId}-column-visibility`,
      JSON.stringify(newColumnVisibilityObject)
    );
  };

  useEffect(() => {
    const savedColumnVisibility = localStorage.getItem(
      `hackathon-${hackathonId}-column-visibility`
    );
    if (savedColumnVisibility) {
      setColumnVisibility(JSON.parse(savedColumnVisibility));
    }
  }, [hackathonId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
            <ChevronDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ScrollArea className="max-w-[70vw] md:max-w-[400px] max-h-[400px]">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide() && column.id !== "Actions"
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => {
                      column.toggleVisibility(value);
                      saveColumnVisibility(column.id, value);
                    }}
                    onSelect={(event) => event.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <ScrollArea className="max-h-[400px] w-[96vw] md:max-w-[61vw]">
        <div className="rounded-md border">
          <Table className="w-[95vw] md:w-max md:min-w-[60vw]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="small"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="small"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ApplicationsTable;
