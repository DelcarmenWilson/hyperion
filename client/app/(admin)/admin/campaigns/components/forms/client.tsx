"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useCampaign, useCampaignViewData } from "../../hooks/use-campaigns";

import { CampaignForm } from "@prisma/client";

import { FormForm } from "./form";
import { FormList } from "./list";
import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";

import { columns } from "./columns";
import { Heading } from "@/components/custom/heading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const FormClient = () => {
  const user = useCurrentUser();
  const { isFormViewOpen, setFormViewOpen } = useCampaign();
  const { forms, isFetchingForms } = useCampaignViewData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="New Form"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={setIsDrawerOpen}
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