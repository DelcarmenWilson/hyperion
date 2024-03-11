"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useRef } from "react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableFilter } from "./data-table-filter";
type DataTableLeadProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  headers?: boolean;
  hidden?: VisibilityState;
  placeHolder?: string;
};

export function DataTableLead<TData, TValue>({
  columns,
  data,
  headers = false,
  hidden = {},
  placeHolder = "Search",
}: DataTableLeadProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(hidden);
  const [rowSelection, setRowSelection] = React.useState({});
  const topRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // columnVisibility: {
      //   firstName: false,
      //   lastName: false,
      //   cellPhone: false,
      //   email: false,
      //   status: false,
      //   vendor: false,
      //   state: false,
      // },
      rowSelection,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="px-1">
      <div ref={topRef} className="pb-2">
        <DataTableFilter
          table={table}
          filtering={filtering}
          setFiltering={setFiltering}
          placeHolder={placeHolder}
        />
        {/* <Input
          placeholder="Search"
          value={filtering}
          onChange={(event) => setFiltering(event.target.value)}
          className="max-w-sm"
        /> */}
      </div>
      <div className="rounded-md border">
        <Table>
          {headers && (
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
          )}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <DataTablePagination table={table} div={topRef} />
    </div>
  );
}
