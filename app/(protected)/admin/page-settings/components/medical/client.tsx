"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/custom/data-table";
import { Heading } from "@/components/custom/heading";
import { MedicalCondition } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { MedicalForm } from "./form";
import { columns } from "./columns";

type MedicalClientProps = {
  initMedical: MedicalCondition[];
};

export const MedicalClient = ({ initMedical }: MedicalClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [medical, setMedical] = useState(initMedical);
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
        <Heading title="Medical" description="Manage all medical conditions" />
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Medical
        </Button>
      </div>

      <DataTable columns={columns} data={medical} searchKey="name" />
    </>
  );
};
