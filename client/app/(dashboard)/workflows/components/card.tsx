"use client";
import { useState } from "react";
import Link from "next/link";
import { useWorkFlowData } from "@/hooks/use-workflow";

import { Workflow } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { WorkflowForm } from "./form";

import { formatDate } from "@/formulas/dates";

export const WorkflowCard = ({ initWorkFlow }: { initWorkFlow: Workflow }) => {
  const { onDeleteWorkflowById } = useWorkFlowData();

  const [workflow, setWorkFlow] = useState(initWorkFlow);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteWorkFlow = () => {
    setLoading(true);
    onDeleteWorkflowById(workflow.id);
    setAlertOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteWorkFlow}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit WorkFlow"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <WorkflowForm workflow={workflow} onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm gap-2">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {workflow.title}
        </h3>

        <CardData label="Description" value={workflow.description} />
        <CardData label="Date Created" value={formatDate(workflow.createdAt)} />
        <CardData label="Date Updated" value={formatDate(workflow.updatedAt)} />
        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button variant="ghost">
            <Link href={`/workflows/${workflow.id}`}>Details</Link>
          </Button>
          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
