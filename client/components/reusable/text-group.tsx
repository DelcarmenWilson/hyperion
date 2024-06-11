import { cn } from "@/lib/utils";

type TextGroupProps = {
  label: string;
  value: string | null | undefined;
  className?: string;
};
export const TextGroup = ({ label, value, className }: TextGroupProps) => {
  return (
    <div className={cn("w-full", className)}>
      <span>{label}: </span>
      <span className="font-bold">{value}</span>
    </div>
  );
};
