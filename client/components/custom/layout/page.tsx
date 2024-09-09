import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PageLayoutProps = {
  icon: LucideIcon;
  cardClass?: string;
  contentClass?: string;
  title: string;
  topMenu?: React.ReactNode;
  children: React.ReactNode;
  justify?: boolean;
  show?: boolean;
  scroll?: boolean;
};
export const PageLayout = ({
  icon: Icon,
  cardClass,
  contentClass,
  title,
  topMenu,
  children,
  justify = true,
  show = false,
  scroll = true,
}: PageLayoutProps) => {
  return (
    <Card
      className={cn(
        "flex flex-col flex-1 relative w-full",
        !show && "overflow-hidden",
        cardClass
      )}
    >
      <div
        className={cn(
          "flex lg:items-center mb-1 lg:flex-row border-b ",
          justify ? "flex-col justify-between" : "items-center"
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-accent p-4 text-primary ">
            <Icon size={20} />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div className="flex gap-2 lg:mr-6 px-2">{topMenu}</div>
      </div>
      <CardContent
        className={cn(
          "flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden w-full",
          contentClass
        )}
      >
        {scroll ? (
          <ScrollArea className="w-full flex-1 pr-2">{children}</ScrollArea>
        ) : (
          <div className="w-full flex-1 pr-2 overflow-hidden">{children}</div>
        )}
      </CardContent>
    </Card>
  );
};
