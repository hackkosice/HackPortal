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
import { ArrowsUpDownIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ApplicationPropertySponsorList } from "@/server/getters/sponsors/getApplicationsForSponsors";

const ActionsCell = ({
  applicationProperties,
}: {
  applicationProperties: ApplicationPropertySponsorList;
}) => {
  return (
    <Stack>
      <Link
        href={`applications/${applicationProperties.id}/detail`}
        className="text-hkOrange"
      >
        Details
      </Link>
    </Stack>
  );
};

type ApplicationsTableProps = {
  hackathonId: number;
  applicationProperties: ApplicationPropertySponsorList[];
};
const SponsorsApplicationsTable = ({
  hackathonId,
  applicationProperties,
}: ApplicationsTableProps) => {
  // Search state
  const [searchEmail, setSearchEmail] = React.useState<string>("");
  const [searchName, setSearchName] = React.useState<string>("");

  // Filter applications based on email and name search
  const filteredApplications = useMemo(() => {
    return applicationProperties.filter((app) => {
      const emailMatch = app.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const teamStr = typeof app.team === "string" ? app.team : "";
      const nameMatch = teamStr
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return emailMatch && nameMatch;
    });
  }, [applicationProperties, searchEmail, searchName]);

  const columns: ColumnDef<ApplicationPropertySponsorList>[] = useMemo(
    () => [
      ...Object.keys(applicationProperties[0] ?? {}).map((key) => ({
        header: ({
          column,
        }: {
          column: Column<ApplicationPropertySponsorList>;
        }) => {
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
        accessorKey: key,
        cell: ({ row }: { row: Row<ApplicationPropertySponsorList> }) => (
          <span>{row.original[key] as string | null}</span>
        ),
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
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data: filteredApplications,
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

  const localStorageKey = `hackathon-sponsors-${hackathonId}-column-visibility`;

  const saveColumnVisibility = (columnName: string, visibility: boolean) => {
    try {
      const raw = localStorage.getItem(localStorageKey) ?? "{}";
      const existing = JSON.parse(raw);
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({ ...existing, [columnName]: visibility })
      );
    } catch {
      localStorage.removeItem(localStorageKey);
    }
  };

  useEffect(() => {
    table.setPageSize(20);
    const saved = localStorage.getItem(localStorageKey);
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved));
      } catch {
        localStorage.removeItem(localStorageKey);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  return (
    <>
      <Stack direction="column" className="w-full gap-4">
        <Stack justify="between" className="w-full gap-2 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <div>
              <label className="text-sm font-medium">Search by Email:</label>
              <input
                type="text"
                placeholder="Email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search by Team Name:</label>
              <input
                type="text"
                placeholder="Team name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </Stack>
        <Stack justify="between" className="w-full">
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
      </Stack>
      <ScrollArea className="max-h-[600px] w-[85vw] md:max-w-[81vw] xl:max-w-[61vw]">
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Rows per page:</label>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
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
      </div>
    </>
  );
};

export default SponsorsApplicationsTable;
