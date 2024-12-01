import Link from "next/link";
import { toast } from "sonner";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

type TopMenuProps = {
  dateRange: DateRange;
  setDateRange: (e: DateRange) => void;
  showLink?: boolean;
  showDate?: boolean;
};
export const TopMenu = ({
  dateRange,
  setDateRange,
  showLink = false,
  showDate = false,
}: TopMenuProps) => {
  return (
    <div className="flex items-center gap-2 w-full text-sm text-muted-foreground text-right mr-6">
      {showLink && (
        <Link href="/appointments" className="text-primary hover:font-semibold">
          View All Appointments
        </Link>
      )}
      <Link href="/calendar" className="text-primary hover:font-semibold">
        Calendar
      </Link>
      {showDate && (
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
      )}
    </div>
  );
};
