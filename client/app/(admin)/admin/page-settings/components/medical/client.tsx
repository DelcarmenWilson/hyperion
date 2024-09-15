"use client";
import React, { useState } from "react";
import { Paperclip, Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Heading } from "@/components/custom/heading";
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

import { MedicalCondition } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { MedicalForm } from "./form";
import { columns } from "./columns";
import { ImportMedicalConditionForm } from "./import/form";
import { useCurrentRole } from "@/hooks/user-current-role";

type MedicalClientProps = {
  initMedicals: MedicalCondition[];
};

export const MedicalClient = ({ initMedicals }: MedicalClientProps) => {
  const role = useCurrentRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [medical, setMedical] = useState(initMedicals);
  const onMedicalCreated = (e?: MedicalCondition) => {
    if (e) {
      setMedical((medical) => {
        return [...medical, e];
      });
    }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Medical Condition"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <MedicalForm onClose={onMedicalCreated} />
      </DrawerRight>
      <div className="flex justify-between items-end">
        <Heading
          title="Medical Conditions"
          description="Manage all medical conditions"
        />
      </div>
      <DataTable
        columns={columns}
        data={medical}
        topMenu={
          <div className="flex gap-2 col-span-3 justify-end">
            {role == "MASTER" && (
              <Dialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button
                        className="gap-2"
                        variant="outlineprimary"
                        size="sm"
                      >
                        <Paperclip size={16} />
                        Upload Csv File
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import Medical conditions</p>
                  </TooltipContent>
                </Tooltip>
                <DialogDescription className="hidden">
                  Admin Medical Conditions Form
                </DialogDescription>
                <DialogContent className="p-0 max-h-[96%] max-w-[98%] bg-transparent">
                  <ImportMedicalConditionForm />
                </DialogContent>
              </Dialog>
            )}
            <Button onClick={() => setIsDrawerOpen(true)} size="sm">
              <Plus size={16} className="mr-2" /> New Medical Condition
            </Button>
          </div>
        }
      />
    </>
  );
};
