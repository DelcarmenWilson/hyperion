"use client";
import { useState } from "react";
import { useWorkflowActions } from "@/hooks/workflow/use-workflow";
import Link from "next/link";
import { Trash } from "lucide-react";

import { Workflow } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { formatDate } from "@/formulas/dates";

type Props = { workflow: Workflow };
export const WorkflowCard = ({ workflow }: Props) => {
  const { alertOpen, setAlertOpen, onWorkflowDelete, workflowDeleteIsPending } =
    useWorkflowActions();

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onWorkflowDelete(workflow.id)}
        loading={workflowDeleteIsPending}
        height="auto"
      />
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm gap-2">
        <Link
          className="text-2xl text-primary font-semibold text-center capitalize hover:font-bold hover:underline"
          href={`/workflows/${workflow.id}`}
        >
          {workflow.title}
        </Link>

        <CardData label="Description" value={workflow.description} />
        <CardData label="Date Created" value={formatDate(workflow.createdAt)} />
        <CardData label="Date Updated" value={formatDate(workflow.updatedAt)} />
        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </>
  );
};
