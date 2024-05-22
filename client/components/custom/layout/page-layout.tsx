import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PageLayoutProps = {
  icon: LucideIcon;
  title: string;
  topMenu?: React.ReactNode;
  children: React.ReactNode;
  justify?: boolean;
};
export const PageLayout = ({
  icon: Icon,
  title,
  topMenu,
  children,
  justify = true,
}: PageLayoutProps) => {
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
      <div
        className={cn(
          "flex lg:items-center mb-1 lg:flex-row border-b ",
          justify ? "flex-col justify-between" : "items-center"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-accent p-4 rounded-br-lg">
            <Icon size={20} className="text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div className="flex gap-2 lg:mr-6 px-2">{topMenu}</div>
      </div>
      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        <ScrollArea className="w-full flex-1 pr-2">{children}</ScrollArea>
      </CardContent>
    </Card>
  );
};
