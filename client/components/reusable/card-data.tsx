import { cn } from "@/lib/utils";

type CardDataProps = {
  title: string;
  value: string;
  column?: boolean;
};

export const CardData = ({ title, value, column = false }: CardDataProps) => {
  if (!value) return null;
  return (
    <div className={cn("flex gap-2", column && "flex-col")}>
      <p className="font-semibold">{title}:</p>
      <span className={cn("text-muted-foreground", column && "ps-4")}>
        {value}
      </span>
    </div>
  );
};
