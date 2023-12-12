"use client";

import React, { useEffect, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { Stack } from "@/components/ui/stack";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";
import inviteHacker from "@/server/actions/dashboard/inviteHacker";

const ActionsCell = ({
  applicationValues,
}: {
  applicationValues: ApplicationFormValuesObject;
}) => {
  const applicationStatus = applicationValues["status"] as ApplicationStatus;
  return (
    <Stack>
      <Link
        href={`applications/${applicationValues.id}/detail`}
        className="text-hkOrange"
      >
        Details
      </Link>
      {applicationStatus === ApplicationStatusEnum.submitted && (
        <Button
          variant="link"
          onClick={async () => {
            await inviteHacker({
              hackerId: Number(applicationValues["hackerId"] as string),
            });
          }}
          className="hover:no-underline"
        >
          Invite
        </Button>
      )}
    </Stack>
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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [filterValue, setFilterValue] = React.useState<string>("all");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data: applicationValues,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnVisibility,
      columnFilters,
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

  const saveFilter = (filter: string) => {
    localStorage.setItem(`hackathon-${hackathonId}-column-filters`, filter);
  };

  useEffect(() => {
    const savedColumnVisibility = localStorage.getItem(
      `hackathon-${hackathonId}-column-visibility`
    );
    if (savedColumnVisibility) {
      setColumnVisibility(JSON.parse(savedColumnVisibility));
    }
    const savedFilter = localStorage.getItem(
      `hackathon-${hackathonId}-column-filters`
    );
    if (savedFilter) {
      table
        .getColumn("status")
        ?.setFilterValue(savedFilter === "all" ? "" : savedFilter);
      setFilterValue(savedFilter);
    }
  }, [hackathonId, table]);

  return (
    <>
      <Stack justify="between" className="w-full">
        <Select
          onValueChange={(value) => {
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? "" : value);
            saveFilter(value);
            setFilterValue(value);
          }}
          value={filterValue}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">(all)</SelectItem>
              {Object.keys(ApplicationStatusEnum).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div>
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
        </div>
      </Stack>
      <ScrollArea className="max-h-[400px] w-[85vw] md:max-w-[81vw] xl:max-w-[61vw]">
        <div className="rounded-md border">
          <Table className="w-[95vw] md:w-max md:min-w-[80vw] xl:min-w-[60vw]">
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
