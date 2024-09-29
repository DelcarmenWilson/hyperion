import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  description?: string;
  size?: "text-xs" | "text-sm" | "text-xl" | "text-2xl" | "text-3xl";
  center?: boolean;
}

export const Heading = ({
  title,
  description,
  size = "text-3xl",
  center = false,
}: HeadingProps) => {
  return (
    <div className={cn("w-full p-2", center && "text-center")}>
      <h2 className={cn("font-bold tracking-tight", size)}>{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
