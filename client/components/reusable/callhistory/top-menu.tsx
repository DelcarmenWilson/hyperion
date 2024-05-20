import { formatSecondsToHours } from "@/formulas/numbers";
import Link from "next/link";
import { DatesFilter } from "../dates-filter";

type TopMenuProps = { duration: number; showLink: boolean; showDate: boolean };
export const TopMenu = ({
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
        <DatesFilter link="/calls" />
      ) : (
        <p>{formatSecondsToHours(duration)}</p>
      )}
      {/* add search and block list
      <p className="font-bold text-primary">1</p> */}
    </div>
  );
};
