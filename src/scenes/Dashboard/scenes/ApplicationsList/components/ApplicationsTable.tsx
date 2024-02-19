"use client";

import React, { useEffect, useMemo } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ApplicationProperty } from "@/server/getters/dashboard/applicationList";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
import { ApplicationStatusEnum } from "@/services/types/applicationStatus";
import { ArrowsUpDownIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Tooltip from "@/components/common/Tooltip";
import InviteHackerButton from "@/scenes/Dashboard/scenes/ApplicationDetail/components/InviteHackerButton";
import RejectHackerButton from "@/scenes/Dashboard/scenes/ApplicationDetail/components/RejectHackerButton";

const ActionsCell = ({
  applicationProperties,
}: {
  applicationProperties: ApplicationProperty;
}) => {
  return (
    <Stack>
      <Link
        href={`applications/${applicationProperties.id}/detail`}
        className="text-hkOrange"
      >
        Details
      </Link>
      {applicationProperties.status === ApplicationStatusEnum.submitted && (
        <>
          <InviteHackerButton
            hackerId={applicationProperties.hackerId}
            hackerEmail={applicationProperties.email}
            variant="text"
          />
          <RejectHackerButton
            hackerId={applicationProperties.hackerId}
            hackerEmail={applicationProperties.email}
            variant="text"
          />
        </>
      )}
    </Stack>
  );
};

type ApplicationsTableProps = {
  hackathonId: number;
  applicationProperties: ApplicationProperty[];
};
const ApplicationsTable = ({
  hackathonId,
  applicationProperties,
}: ApplicationsTableProps) => {
  const columns: ColumnDef<ApplicationProperty>[] = useMemo(
    () => [
      ...Object.keys(applicationProperties[0] ?? {}).map((key) => ({
        header: ({ column }: { column: Column<ApplicationProperty> }) => {
          if (!["score", "status", "team"].includes(key)) {
            return key;
          }
          return (
            <Button
              variant="link"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="text-slate-500"
            >
              {key}
              <ArrowsUpDownIcon className="ml-1 h-4 w-4" />
            </Button>
          );
        },
        id: key,
        accessorKey: key === "score" ? "score.score" : key,
        cell: ({ row }: { row: Row<ApplicationProperty> }) => {
          if (key === "score") {
            const score = row.original.score;
            const status = row.original.status;
            if (status === ApplicationStatusEnum.open) {
              return null;
            }
            return (
              <Tooltip
                trigger={
                  <span
                    className="cursor-pointer"
                    style={{
                      color: score.relevance.color,
                    }}
                  >
                    {score.score.toFixed(2)}
                  </span>
                }
                content={`${score.relevance.value} relevance (${
                  score.numberOfVotes
                } ${score.numberOfVotes === 1 ? "vote" : "votes"})`}
              />
            );
          }
          return <span>{row.original[key] as string | null}</span>;
        },
      })),
      {
        id: "Actions",
        cell: ({ row }) => <ActionsCell applicationProperties={row.original} />,
      },
    ],
    [applicationProperties]
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState<string>("all");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data: applicationProperties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      columnFilters,
      sorting,
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
                <ChevronDownIcon className="ml-2 w-4 h-4" />
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
