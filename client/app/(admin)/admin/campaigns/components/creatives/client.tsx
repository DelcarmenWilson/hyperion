"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCampaign, useCampaignViewData } from "../../hooks/use-campaigns";

import { CampaignCreative } from "@prisma/client";

import { CreativeForm } from "./form";
import { CreativeList } from "./list";
import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";

import { columns } from "./columns";
import { Heading } from "@/components/custom/heading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const CreativeClient = () => {
  const user = useCurrentUser();
  const { isCreativeViewOpen, setCreativeViewOpen } = useCampaign();
  const { creatives, isFetchingCreatives } = useCampaignViewData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="New Creative"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={setIsDrawerOpen}
    />
  );
  const onCreativeCreated = (e?: CampaignCreative) => {
    // if (e) {
    //   setTasks((tasks) => {
    //     return [...tasks, e];
    //   });
    // }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title="New Creative"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CreativeForm onClose={onCreativeCreated} />
      </DrawerRight>
      <div
        className={cn(
          "flex flex-col absolute bg-background inset-0 border p-4 transition-[top] top-full ease-in-out duration-500 h-full w-full overflow-hidden",
          isCreativeViewOpen && "top-0"
        )}
      >
        <div className="flex justify-between">
          <Heading
            title="Creatives"
            size="text-xl"
            description={"List of creatives in this account"}
          />
          <Button variant="ghost" onClick={setCreativeViewOpen}>
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isList ? (
            <DataTable
              columns={columns}
              data={creatives || []}
              headers
              topMenu={topMenu}
            />
          ) : (
            <>
              <div className="p-2">{topMenu}</div>
              <CreativeList initCreatives={creatives!} />
            </>
          )}
        </div>
      </div>
    </>
  );
};