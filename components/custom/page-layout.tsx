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
    <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
      <div className="flex flex-col justify-between lg:items-center mb-2 lg:flex-row ">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div className="flex gap-2 lg:mr-6 px-2">{topMenu}</div>
      </div>
      <Separator />
      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        <ScrollArea className="w-full flex-1 pr-2 py-4">{children}</ScrollArea>
      </CardContent>
    </Card>
  );
};
