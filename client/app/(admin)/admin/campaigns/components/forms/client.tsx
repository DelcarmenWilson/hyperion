"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useCampaignStore } from "@/stores/campaign-store";
import { useCampaignViewData } from "@/hooks/use-campaigns";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import { CampaignForm } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { FormForm } from "./form";
import { FormList } from "./list";
import { DrawerRight } from "@/components/custom/drawer/right";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";

export const FormClient = () => {
  const user = useCurrentUser();
  const { isFormViewOpen, setFormViewOpen } = useCampaignStore();
  const { forms, isFetchingForms } = useCampaignViewData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="New Form"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
    />
  );
  const onFormCreated = (e?: CampaignForm) => {
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
        title="New Form"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <FormForm onClose={onFormCreated} />
      </DrawerRight>
      <div
        className={cn(
          "flex flex-col absolute bg-background inset-0 border p-4 transition-[top] top-full ease-in-out duration-500 h-full w-full overflow-hidden",
          isFormViewOpen && "top-0"
        )}
      >
        <div className="flex justify-between">
          <Heading
            title="Forms"
            size="text-xl"
            description={"List of forms in this account"}
          />
          <Button variant="ghost" onClick={setFormViewOpen}>
            <X size={16} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isList ? (
            <DataTable
              columns={columns}
              data={forms || []}
              headers
              topMenu={topMenu}
            />
          ) : (
            <>
              <div className="p-2">{topMenu}</div>
              <FormList initForms={forms!} />
            </>
          )}
        </div>
      </div>
    </>
  );
};
