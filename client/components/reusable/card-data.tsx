import { cn } from "@/lib/utils";

type CardDataProps = {
  label: string;
  value: string | null | undefined;
  column?: boolean;
  center?: boolean;
};

export const CardData = ({
  label,
  value,
  column = false,
  center = false,
}: CardDataProps) => {
  if (!value) return null;
  return (
    <div
      className={cn(
        "flex gap-2",
        column && "flex-col",
        center && "justify-center"
      )}
    >
      <p className="font-semibold">{label}:</p>
      <span className={cn("text-muted-foreground", column && "ps-4")}>
        {value}
      </span>
    </div>
  );
};
