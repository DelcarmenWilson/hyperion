import { cn } from "@/lib/utils";

type CardDataProps = {
  label: string;
  value: string;
  column?: boolean;
};

export const CardData = ({ label, value, column = false }: CardDataProps) => {
  if (!value) return null;
  return (
    <div className={cn("flex gap-2", column && "flex-col")}>
      <p className="font-semibold">{label}:</p>
      <span className={cn("text-muted-foreground", column && "ps-4")}>
        {value}
      </span>
    </div>
  );
};
