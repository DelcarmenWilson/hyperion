"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCampaign, useCampaignViewData } from "../../hooks/use-campaigns";

import { CampaignAudience } from "@prisma/client";

import { AudienceForm } from "./form";
import { AudienceList } from "./list";
import { DrawerRight } from "@/components/custom/drawer/right";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";

import { columns } from "./columns";
import { Heading } from "@/components/custom/heading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const AudienceClient = () => {
  const user = useCurrentUser();
  const { isAudienceViewOpen, setAudienceViewOpen } = useCampaign();
  const { audiences, isFetchingAudiences } = useCampaignViewData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="New Audience"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
    />
  );
  const onAudienceCreated = (e?: CampaignAudience) => {
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
        title="New Audience"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <AudienceForm onClose={onAudienceCreated} />
      </DrawerRight>
      <div
        className={cn(
          "flex flex-col absolute bg-background inset-0 border p-4 transition-[top] top-full ease-in-out duration-500 h-full w-full overflow-hidden",
          isAudienceViewOpen && "top-0"
        )}
      >
        <div className="flex justify-between">
          <Heading
            title="Audiences"
            size="text-xl"
            description={"List of audiences in this account"}
          />
          <Button variant="ghost" onClick={setAudienceViewOpen}>
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isList ? (
            <DataTable
              columns={columns}
              data={audiences || []}
              headers
              topMenu={topMenu}
            />
          ) : (
            <>
              <div className="p-2">{topMenu}</div>
              <AudienceList initAudiences={audiences!} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
