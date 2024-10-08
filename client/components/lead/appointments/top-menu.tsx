import { DatesFilter } from "@/components/reusable/dates-filter";
import Link from "next/link";
import { DateRange } from "react-day-picker";

type TopMenuProps = {
  onDateSelected?: (e: DateRange) => void;
  showLink?: boolean;
  showDate?: boolean;
};
export const TopMenu = ({
  onDateSelected,
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
        <DatesFilter link="/appointments" onDateSelected={onDateSelected} />
      )}
    </div>
  );
};
