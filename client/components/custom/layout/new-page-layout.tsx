import { ScrollArea } from "@/components/ui/scroll-area";
import React, { ReactNode } from "react";

type Props = {
  title: string;
  subTitle: string;
  children: ReactNode;
  topMenu?: ReactNode;
};

const NewPageLayout = ({ children, topMenu, title, subTitle }: Props) => {
  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subTitle}</p>
        </div>
        {topMenu}
      </div>

      <div className="flex-1 h-full py-6 overflow-hidden">
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  );
};

export default NewPageLayout;