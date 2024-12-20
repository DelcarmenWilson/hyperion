"use client";
import * as React from "react";
import { useRef } from "react";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AdvancePagination } from "@/components/tables/pagination/advance";
import { SimpleFilter } from "@/components/tables/filter/simple";
import { LeadFilter } from "@/components/tables/filter/lead";
import { SimplePagination } from "./pagination/simple";
import { cn } from "@/lib/utils";
import { CallFilter } from "./filter/call";
import { AppointmentFilter } from "./filter/appointment";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  topMenu?: React.ReactElement | null;
  headers?: boolean;
  search?: boolean;
  hidden?: VisibilityState;
  placeHolder?: string;
  striped?: boolean;
  filterType?: "advance" | "appointment" | "lead" | "simple" | "call";
  paginationType?: "advance" | "lead" | "simple";
};

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  topMenu,
  headers = false,
  search = true,
  hidden = {},
  placeHolder = "Search",
  striped = false,
  filterType = "simple",
  paginationType = "simple",
}: DataTableProps<TData, TValue>) {
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
      rowSelection,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-1 w-full">
      <div ref={topRef} className="pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          <div className="flex items-center gap-2">
            {title && <h4 className="text-lg font-semibold">{title}</h4>}

            {search && (
              <SimpleFilter
                filtering={filtering}
                setFiltering={setFiltering}
                placeHolder={placeHolder}
              />
            )}
          </div>
          {filterType == "lead" && <LeadFilter table={table} />}
          {filterType == "call" && <CallFilter table={table} />}
          {filterType == "appointment" && <AppointmentFilter table={table} />}

          {topMenu}
        </div>
      </div>
      <div className="rounded-md border w-full overflow-hidden">
        <Table className="w-full">
          {headers && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-5">
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
                  className={cn(
                    "relative group",
                    striped ? "even:bg-secondary" : ""
                  )}
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
      {paginationType == "simple" ? (
        <SimplePagination table={table} />
      ) : (
        <AdvancePagination table={table} div={topRef} />
      )}
    </div>
  );
}
