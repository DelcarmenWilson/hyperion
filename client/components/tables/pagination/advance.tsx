import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type AdvancePaginationProps<TData> = {
  table: Table<TData>;
  div?: React.RefObject<HTMLDivElement>;
};

export function AdvancePagination<TData>({
  table,
  div,
}: AdvancePaginationProps<TData>) {
  const [pageNumber, setPageNumber] = useState<string>();
  const onPrevNextClick = (direction: string) => {
    if (direction == "prev") {
      table.previousPage();
    } else {
      table.nextPage();
    }
    div?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onFirstLastClick = (pageNum: number) => {
    table.setPageIndex(pageNum);
    div?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onGoToPage = () => {
    if (!pageNumber) return;
    let pageNum = parseInt(pageNumber);
    if (pageNum < 0) return;
    const size = table.getPageCount();
    if (pageNum > size) {
      pageNum = size;
      setPageNumber(size.toString());
    }

    table.setPageIndex(pageNum - 1);
  };
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between px-2 my-1">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-x-6 lg:space-x-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium">Go to Page</p>
          <Input
            value={pageNumber}
            onChange={(e) => setPageNumber(e.target.value)}
            className="h-8 w-[70px]"
          />
          <Button
            className="hidden h-8 w-8 p-0 lg:flex"
            disabled={!pageNumber}
            onClick={onGoToPage}
          >
            <span className="sr-only">Jump to first</span>
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onFirstLastClick(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPrevNextClick("prev")}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPrevNextClick("next")}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onFirstLastClick(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
