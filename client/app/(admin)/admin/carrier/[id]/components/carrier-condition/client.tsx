"use client";
import { useEffect, useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Paperclip } from "lucide-react";

import { Carrier } from "@prisma/client";
import { FullCarrierCondition } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DrawerRight } from "@/components/custom/drawer/right";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

import { CarrierConditionsList } from "./list";
import { CarrierConditionForm } from "./form";

import { ImportCarrierConditionsForm } from "./import-form";

export const CarrierConditionClient = ({
  carrier,
  initCarrierConditions,
}: {
  carrier: Carrier;
  initCarrierConditions: FullCarrierCondition[];
}) => {
  const user = useCurrentUser();
  const [carrierConditions, setCarrierConditions] = useState(
    initCarrierConditions
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <ListGridTopMenu
      text="Add Carrier Condition"
      isList={isList}
      setIsList={setIsList}
      setIsDrawerOpen={() => setIsDrawerOpen(true)}
      showButton={user?.role != "ASSISTANT"}
    />
  );

  useEffect(() => {
    const onCarrierConditionDeleted = (conditionId: string) => {
      setCarrierConditions((carrierconditions) => {
        if (!carrierconditions) return carrierconditions;
        return carrierconditions.filter((e) => e.conditionId !== conditionId);
      });
    };
    const onCarrierConditionInserted = (
      newCarrierCondition: FullCarrierCondition
    ) => {
      const existing = carrierConditions?.find(
        (e) => e.conditionId == newCarrierCondition.conditionId
      );
      if (existing == undefined)
        setCarrierConditions((carrierconditions) => [
          ...carrierconditions!,
          newCarrierCondition,
        ]);
    };

    const onCarrierConditionUpdated = (
      updatedCarrierCondition: FullCarrierCondition
    ) => {
      setCarrierConditions((carrierconditions) => {
        if (!carrierconditions) return carrierconditions;
        return carrierconditions
          .filter((e) => e.conditionId != updatedCarrierCondition.conditionId)
          .concat(updatedCarrierCondition);
      });
    };
    userEmitter.on("carrierConditionDeleted", (id) =>
      onCarrierConditionDeleted(id)
    );
    userEmitter.on("carrierConditionInserted", (info) =>
      onCarrierConditionInserted(info)
    );
    userEmitter.on("carrierConditionUpdated", (info) =>
      onCarrierConditionUpdated(info)
    );
    return () => {
      userEmitter.on("carrierConditionDeleted", (id) =>
        onCarrierConditionDeleted(id)
      );
      userEmitter.on("carrierConditionInserted", (info) =>
        onCarrierConditionInserted(info)
      );
      userEmitter.on("carrierConditionUpdated", (info) =>
        onCarrierConditionUpdated(info)
      );
    };

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="outlineprimary" size="sm">
                <Paperclip size={16} />
                Upload Csv File
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Import Leads</p>
          </TooltipContent>
        </Tooltip>
        <DialogDescription className="hidden">
          Carrier Conditions Form
        </DialogDescription>
        <DialogContent className="p-0 max-h-[96%] max-w-[98%] bg-transparent">
          <ImportCarrierConditionsForm carrier={carrier} />
        </DialogContent>
      </Dialog>
      <DrawerRight
        title={"New CarrierCondition"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CarrierConditionForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>
      {isList ? (
        <DataTable
          columns={columns}
          data={carrierConditions!}
          headers
          title="Carrier Conditions"
          topMenu={topMenu}
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Grid Sheet</h4>
            {topMenu}
          </div>
          <CarrierConditionsList carrierConditions={carrierConditions!} />
        </>
      )}
    </>
  );
};
