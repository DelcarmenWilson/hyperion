"use client";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { WorkFlow } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { WorkFlowForm } from "./form";

import { workFlowDeleteById } from "@/actions/workflow";
import { formatDate } from "@/formulas/dates";

type WorkFlowCardProps = {
  initWorkFlow: WorkFlow;
};
export const WorkFlowCard = ({ initWorkFlow }: WorkFlowCardProps) => {
  const queryClient = useQueryClient();

  const [workflow, setWorkFlow] = useState(initWorkFlow);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteWorkFlow = async () => {
    setLoading(true);
    const deletedWorkFlow = await workFlowDeleteById(workflow.id);

    if (deletedWorkFlow.success) {
      queryClient.invalidateQueries({
        queryKey: ["agentWorkFlows"],
      });
      toast.success(deletedWorkFlow.success);
    } else toast.error(deletedWorkFlow.error);

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
        <WorkFlowForm workflow={workflow} onClose={() => setIsOpen(false)} />
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
