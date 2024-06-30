import { formatSecondsToHours } from "@/formulas/numbers";
import Link from "next/link";
import { DatesFilter } from "../dates-filter";
import { DateRange } from "react-day-picker";

type TopMenuProps = {
  duration: number;
  onDateSelected?: (e: DateRange) => void;
  showLink: boolean;
  showDate: boolean;
};
export const TopMenu = ({
  duration,
  onDateSelected,
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
        <DatesFilter link="/calls" onDateSelected={onDateSelected} />
      ) : (
        <p>{formatSecondsToHours(duration)}</p>
      )}
      {/* add search and block list
      <p className="font-bold text-primary">1</p> */}
    </div>
  );
};
