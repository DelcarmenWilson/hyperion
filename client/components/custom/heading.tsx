import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  description?: string;
  size?: "text-xs" | "text-sm" | "text-xl" | "text-2xl" | "text-3xl";
}

export const Heading = ({
  title,
  description,
  size = "text-3xl",
}: HeadingProps) => {
  return (
    <div className="p-2 mb-2">
      <h2 className={cn("font-bold tracking-tight", size)}>{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
