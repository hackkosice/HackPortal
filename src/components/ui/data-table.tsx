"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  shouldUsePagination?: boolean;
  shouldHaveFiltering?: boolean;
  filterColumn?: string;
  hasRowSelection?: boolean;
  rowSelectionAction?: (rowSelection: string[]) => ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  shouldUsePagination,
  shouldHaveFiltering,
  filterColumn,
  hasRowSelection,
  rowSelectionAction,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: shouldUsePagination
      ? getPaginationRowModel()
      : undefined,
    getFilteredRowModel: shouldHaveFiltering
      ? getFilteredRowModel()
      : undefined,
    onColumnFiltersChange: shouldHaveFiltering ? setColumnFilters : undefined,
    state:
      shouldHaveFiltering || hasRowSelection
        ? {
            columnFilters: shouldHaveFiltering ? columnFilters : undefined,
            rowSelection: hasRowSelection ? rowSelection : undefined,
          }
        : undefined,
    onRowSelectionChange: hasRowSelection ? setRowSelection : undefined,
  });

  return (
    <>
      {shouldHaveFiltering && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter..."
            value={
              (table
                .getColumn(filterColumn ?? "value")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterColumn ?? "value")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <ScrollArea className="h-[400px]">
        <div className="rounded-md border min-w-full">
          <Table>
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
      </ScrollArea>
      {hasRowSelection &&
        rowSelectionAction &&
        Object.keys(rowSelection).length > 0 && (
          <div className="pt-2">
            {rowSelectionAction(Object.keys(rowSelection))}
          </div>
        )}
      {shouldUsePagination && (
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
      )}
    </>
  );
}
