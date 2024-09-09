"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type PageLayoutAdminProps = {
  title: string;
  description: string;
  topMenu?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
};
export const PageLayoutAdmin = ({
  title,
  description,
  topMenu,
  children,
  scroll = true,
}: PageLayoutAdminProps) => {
  return (
    <Card className="flex flex-col flex-1 relative overflow-hidden h-full w-full mt-2">
      <div className="flex flex-col justify-between lg:items-center lg:flex-row ">
        <div className="px-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="px-4">{topMenu}</div>
      </div>
      <Separator />
      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        {scroll ? (
          <ScrollArea className="w-full flex-1 pr-2 py-1">
            {children}
          </ScrollArea>
        ) : (
          <div className="flex flex-col w-full flex-1 pr-2 py-1 overflow-hidden">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
