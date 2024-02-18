"use client";

import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type PageLayoutProps = {
  icon: LucideIcon;
  title: string;
  topMenu?: React.ReactNode;
  children: React.ReactNode;
};
export const PageLayout = ({
  icon: Icon,
  title,
  topMenu,
  children,
}: PageLayoutProps) => {
  return (
    <Card className="flex flex-col relative w-full">
      <div className="flex justify-between items-start lg:items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mr-6">{topMenu}</div>
      </div>
      <Separator />
      <CardContent className="flex-1 items-center space-y-0 gap-2 py-2">
        <ScrollArea className="w-full flex-1 pr-2">{children}</ScrollArea>
      </CardContent>
    </Card>
  );
};
