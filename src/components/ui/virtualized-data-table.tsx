"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  Row,
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
import { useVirtualizer } from "@tanstack/react-virtual";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  shouldUsePagination?: boolean;
  shouldHaveFiltering?: boolean;
  filterColumn?: string;
  hasRowSelection?: boolean;
  rowSelectionAction?: (rowSelection: string[]) => ReactNode;
}

export function VirtualizedDataTable<TData, TValue>({
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

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: rows.length,
    estimateSize: () => 45,
    overscan: 5,
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
      <div ref={tableContainerRef} className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="w-fit">
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
          <TableBody
            className="relative w-[400px]"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {/* Only the visible items in the virtualizer, manually positioned to be in view */}
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const row = rows[virtualItem.index] as Row<TData>;
              return (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id} className="p-2 text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
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
