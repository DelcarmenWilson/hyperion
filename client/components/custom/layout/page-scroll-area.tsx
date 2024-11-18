import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  children: React.ReactNode;
};
export const PageScrollArea = ({ children }: Props) => {
  return (
    <ScrollArea className="flex-1 w-full gap-2">
      <div className="flex flex-col w-full gap-2">{children}</div>
    </ScrollArea>
  );
};
