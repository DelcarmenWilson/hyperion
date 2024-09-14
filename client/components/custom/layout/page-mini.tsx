import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
type Props = {
  icon: LucideIcon;
  title: string;
  name: string;
  status?: React.ReactNode;
  children: React.ReactNode;
};
export const PageMiniLayout = ({
  icon: Icon,
  title,
  name,
  status,
  children,
}: Props) => {
  return (
    <Card className="flex flex-col flex-1  relative overflow-hidden">
      <div className="flex items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <p className="flex-1">
            {title} - <span>{name}</span>
          </p>
        </div>
        <div className="ml-auto px-2">{status}</div>
      </div>
      <Separator />
      <CardContent className="flex flex-col flex-1 bg-secondary/80 p-2 gap-2 overflow-hidden">
        <ScrollArea>{children}</ScrollArea>
      </CardContent>
    </Card>
  );
};
