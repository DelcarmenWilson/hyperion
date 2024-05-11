import { formatSecondsToHours } from "@/formulas/numbers";

type TopMenuProps = { duration: number };
export const TopMenu = ({ duration }: TopMenuProps) => {
  return (
    <div className="w-full text-sm text-muted-foreground text-right mr-6">
      {duration > 0 && <p>{formatSecondsToHours(duration)}</p>}
      {/* add search and block list
      <p className="font-bold text-primary">1</p> */}
    </div>
  );
};
