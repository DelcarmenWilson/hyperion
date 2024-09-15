import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  height?: string;
};
export const EmptyData = ({
  title = "No data Found",
  height = "h-[200px]",
}: Props) => {
  return <div className={cn("flex-center text-sm", height)}>{title}</div>;
};
