"use client"
import TooltipWrapper from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

type Props={title:string 
    description?:string|null
}
const TopBar = ({title,description}:Props) => {
    const router=useRouter()
  return (
    <div className="flex p-2 border-b-2 border-separate justify-between w-full h-[60px] sticky bg-background z-10">
      <div className="flex flex-1 gap-1">
        <TooltipWrapper content="Back">
          <Button variant={"ghost"} size="icon" onClick={()=>router.back()}>
            <ChevronLeftIcon size={20} />
          </Button>
        </TooltipWrapper>
        <div>
            <p className="font-bold text-ellipsis truncate">
                {title}
            </p>
            {description&&(<p className="text-xs text-muted-foreground text-ellipsis truncate">
             { description}  
            </p>)}
            
        </div>
      </div>
    </div>
  );
};

export default TopBar;
