"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Cloud } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  size?: "sm" | "md" | "lg" | "xl";
  noresults?: string;
  setFile?: (e: any) => void;
}

export function DataTableImport<TData, TValue>({
  columns,
  data,
  size,
  noresults = "No Results",
  setFile,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const setsize = () => {
    switch (size) {
      case "sm":
        return "min-w-[50px]";
      case "md":
        return "min-w-[75px]";
      case "lg":
        return "min-w-[100px]";
      case "xl":
        return "min-w-[150px]";
      default:
        return "min-w-[50px]";
    }
  };
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className=" sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={setsize()}>
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <label className="">
                  <input type="file" accept=".csv" onChange={setFile} hidden />
                  <div className="flex flex-col justify-center items-center w-full h-20 rounded border-2 border-dashed cursor-pointer text-muted-foreground">
                    <Cloud className="w-8 h-8" />
                    <span className="font-bold  text-xl">{noresults}</span>
                  </div>
                </label>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
