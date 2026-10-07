"use client";

import React, { useDeferredValue, useEffect, useMemo } from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
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
  ApplicationFilter,
  ApplicationProperty,
} from "@/server/getters/dashboard/applicationList";
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
import {
  ArrowsUpDownIcon,
  ChevronDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
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

// Text shown in the table for the given column, used for searching
const getDisplayValue = (application: ApplicationProperty, key: string) => {
  if (key === "score") {
    return application.status === ApplicationStatusEnum.open
      ? ""
      : application.score.score.toFixed(2);
  }
  return String(application[key] ?? "");
};

// Lowercase without diacritics, so "kosice" finds "Košice"
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const containsText: FilterFn<ApplicationProperty> = (
  row,
  columnId,
  filterValue: string
) =>
  normalize(String(row.getValue(columnId) ?? "")).includes(
    normalize(filterValue.trim())
  );

const includesValue: FilterFn<ApplicationProperty> = (
  row,
  columnId,
  filterValue: string[]
) => filterValue.includes(String(row.getValue(columnId) ?? ""));

const ColumnFilter = ({
  column,
  options,
}: {
  column: Column<ApplicationProperty>;
  options: string[] | null;
}) => {
  const filterValue = column.getFilterValue();
  const selectedOptions: string[] = Array.isArray(filterValue)
    ? filterValue
    : [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="unstyled"
          size="smallest"
          aria-label={`Filter ${column.id}`}
          className={
            column.getIsFiltered()
              ? "ml-1 text-hkOrange"
              : "ml-1 text-slate-400"
          }
        >
          <FunnelIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options ? (
          <ScrollArea className="max-w-[70vw] md:max-w-[400px] max-h-[400px]">
            {/* Empty option to find applications without an answer */}
            {[...options, ""].map((option) => (
              <DropdownMenuCheckboxItem
                key={option}
                className="cursor-pointer"
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => {
                  const newOptions = checked
                    ? [...selectedOptions, option]
                    : selectedOptions.filter((value) => value !== option);
                  column.setFilterValue(
                    newOptions.length > 0 ? newOptions : undefined
                  );
                }}
                onSelect={(event) => event.preventDefault()}
              >
                {option || "(empty)"}
              </DropdownMenuCheckboxItem>
            ))}
          </ScrollArea>
        ) : (
          <Input
            autoFocus
            aria-label={`Filter ${column.id} value`}
            placeholder="Contains..."
            value={typeof filterValue === "string" ? filterValue : ""}
            onChange={(event) =>
              column.setFilterValue(event.target.value || undefined)
            }
            // Dropdown menu typeahead would steal the focus from the input
            onKeyDown={(event) => {
              if (event.key !== "Escape") {
                event.stopPropagation();
              }
            }}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Values come from hackers, so cells that a spreadsheet would run as a formula are prefixed with '
const toCsvCell = (value: string) =>
  `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replace(/"/g, '""')}"`;

export const toCsv = (rows: string[][]) =>
  rows.map((row) => row.map(toCsvCell).join(",")).join("\n");

type ApplicationsTableProps = {
  hackathonId: number;
  filters?: ApplicationFilter[];
  applicationProperties: ApplicationProperty[];
};
const ApplicationsTable = ({
  hackathonId,
  filters,
  applicationProperties,
}: ApplicationsTableProps) => {
  const columns: ColumnDef<ApplicationProperty>[] = useMemo(
    () => [
      ...Object.keys(applicationProperties[0] ?? {}).map((key) => {
        const filter = filters?.find(({ column }) => column === key);
        return {
          header: ({ column }: { column: Column<ApplicationProperty> }) => (
            <span className="inline-flex items-center">
              {["score", "status", "team"].includes(key) ? (
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
              ) : (
                key
              )}
              {filter && (
                <ColumnFilter column={column} options={filter.options} />
              )}
            </span>
          ),
          id: key,
          // accessorFn instead of accessorKey, because field labels can contain dots
          accessorFn: (row: ApplicationProperty) =>
            key === "score" ? row.score.score : row[key],
          filterFn: filter?.options ? includesValue : containsText,
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
        };
      }),
      {
        id: "Actions",
        cell: ({ row }) => <ActionsCell applicationProperties={row.original} />,
      },
    ],
    [applicationProperties, filters]
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filterValue, setFilterValue] = React.useState<string>("all");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [search, setSearch] = React.useState<string>("");
  // Deferred, so typing stays responsive with a lot of applications
  const deferredSearch = useDeferredValue(search);
  // Normalized once, so searching does not redo it on every keystroke
  const searchIndex = useMemo(
    () =>
      new Map(
        applicationProperties.map((application) => [
          application,
          Object.fromEntries(
            Object.keys(application).map((key) => [
              key,
              normalize(getDisplayValue(application, key)),
            ])
          ),
        ])
      ),
    [applicationProperties]
  );
  const data = useMemo(() => {
    const words = normalize(deferredSearch).split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return applicationProperties;
    }
    const visibleKeys = Object.keys(applicationProperties[0] ?? {}).filter(
      (key) => columnVisibility[key] !== false
    );
    // Every word has to be found, but each can be in a different column
    return applicationProperties.filter((application) =>
      words.every((word) =>
        visibleKeys.some((key) =>
          searchIndex.get(application)?.[key]?.includes(word)
        )
      )
    );
  }, [applicationProperties, searchIndex, deferredSearch, columnVisibility]);
  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => String(row.id),
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
    table.setPageSize(20);
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

  const filteredRows = table.getPrePaginationRowModel().rows;
  // CSV is built on click, so it costs nothing while filtering
  const downloadExport = () => {
    const exportColumns = table
      .getVisibleLeafColumns()
      .filter((column) => column.id !== "Actions");
    const csv = toCsv([
      exportColumns.map((column) => column.id),
      ...filteredRows.map((row) =>
        exportColumns.map((column) => getDisplayValue(row.original, column.id))
      ),
    ]);
    // BOM, so Excel reads diacritics correctly
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `applications-${hackathonId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    table.resetColumnFilters(true);
    setSearch("");
    saveFilter("all");
    setFilterValue("all");
  };

  return (
    <>
      <Stack justify="between" className="w-full flex-wrap">
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
        <Input
          aria-label="Search applications"
          placeholder="Search..."
          className="w-[250px]"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Stack alignItems="center">
          <span className="text-sm text-slate-500">
            {filteredRows.length} of {applicationProperties.length}
          </span>
          {(columnFilters.length > 0 || search !== "") && (
            <Button variant="link" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
          <Button variant="outline" onClick={downloadExport}>
            Download export
          </Button>
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
                          if (!value) {
                            // Filter of a hidden column could not be seen or changed
                            column.setFilterValue(undefined);
                          }
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
