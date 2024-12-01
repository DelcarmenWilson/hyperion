import { formatSecondsToHours } from "@/formulas/numbers";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "../ui/date-range-picker";
import { differenceInDays } from "date-fns";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { toast } from "sonner";

type TopMenuProps = {
  dateRange: DateRange;
  setDateRange: (e: DateRange) => void;
  duration: number;
  showLink: boolean;
  showDate: boolean;
};
export const TopMenu = ({
  dateRange,
  setDateRange,
  duration,
  showLink = false,
  showDate = false,
}: TopMenuProps) => {
  return (
    <div className="flex gap-2 w-full text-sm text-muted-foreground text-right mr-6">
      {showLink && (
        <Link href="/calls" className="text-primary hover:font-semibold">
          View All
        </Link>
      )}
      {showDate ? (
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
      ) : (
        <p>{formatSecondsToHours(duration)}</p>
      )}
      {/* add search and block list
      <p className="font-bold text-primary">1</p> */}
    </div>
  );
};
