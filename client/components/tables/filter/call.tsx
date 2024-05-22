import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CallFilterProps<TData> = {
  table: Table<TData>;
};

export function CallFilter<TData>({ table }: CallFilterProps<TData>) {
  const callStatus: string[] = [
    "Completed",
    "No-Answer",
    "Canceled",
    "Busy",
    "Ringing",
    "Failed",
  ];

  const OnFilter = (column: string, filter: string) => {
    if (filter == "%") {
      filter = "";
    }
    table.getColumn(column)?.setFilterValue(filter);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">Direction</p>
        <Select
          name="ddlDirection"
          onValueChange={(e) => OnFilter("direction", e)}
          defaultValue="%"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">All</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outboud</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-muted-foreground">Status</p>
        <Select
          name="ddlStatus"
          defaultValue="%"
          onValueChange={(e) => OnFilter("status", e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="%">All</SelectItem>
            {callStatus.map((status, i) => (
              <SelectItem key={i} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
