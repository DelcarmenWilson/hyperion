import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";

type TopMenuProps = {
  dateRange: DateRange;
  setDateRange: (e: DateRange) => void;
};
export const TopMenu = ({ dateRange, setDateRange }: TopMenuProps) => {
  return (
    <div className="flex gap-2 w-full text-sm text-muted-foreground text-right mr-6">
      <DateRangePicker
        initialDateFrom={dateRange.from}
        initialDateTo={dateRange.to}
        onUpdate={(values) => {
          const { from, to } = values.range;
          if (!from || !to) return;
          if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
            toast.error(
              `The selected date range od to big. Max allowed range is ${MAX_DATE_RANGE_DAYS}`
            );
            return;
          }
          setDateRange({ from, to });
        }}
        showCompare={false}
      />
    </div>
  );
};
