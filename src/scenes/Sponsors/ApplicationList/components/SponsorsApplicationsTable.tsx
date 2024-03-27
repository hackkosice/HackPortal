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
      localStorage.getItem(
        `hackathon-sponsors-${hackathonId}-column-visibility`
      ) ?? "{}";
    const oldColumnVisibilityObject = JSON.parse(oldColumnVisibility);
    const newColumnVisibilityObject = {
      ...oldColumnVisibilityObject,
      [columnName]: visibility,
    };
    localStorage.setItem(
      `hackathon-sponsors-${hackathonId}-column-visibility`,
      JSON.stringify(newColumnVisibilityObject)
    );
  };

  useEffect(() => {
    table.setPageSize(20);
    const savedColumnVisibility = localStorage.getItem(
      `hackathon-sponsors-${hackathonId}-column-visibility`
    );
    if (savedColumnVisibility) {
      setColumnVisibility(JSON.parse(savedColumnVisibility));
    }
  }, [hackathonId, table]);

  return (
    <>
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

export default SponsorsApplicationsTable;
