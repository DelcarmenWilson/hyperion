"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "@/components/custom/heading";

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
    <Card className="flex flex-col flex-1 relative overflow-hidden w-full mt-2">
      <div className="flex flex-col justify-between lg:items-center mb-2 lg:flex-row ">
        <div>
          <CardTitle>
            <Heading title={title} description={description} />
          </CardTitle>
        </div>
        <div className="px-4">{topMenu}</div>
      </div>
      <Separator />
      <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
        {scroll ? (
          <ScrollArea className="w-full flex-1 pr-2 py-4">
            {children}
          </ScrollArea>
        ) : (
          <div className="flex flex-col w-full flex-1 pr-2 py-4 overflow-hidden">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
