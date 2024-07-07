"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { WorkflowTriggerSchemaType } from "@/schemas/workflow/trigger";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { TriggerForm } from "./form";

import { formatDate } from "@/formulas/dates";
import { workflowNodeDeleteById } from "@/actions/workflow/default";

export const TriggerCard = ({
  trigger,
}: {
  trigger: WorkflowTriggerSchemaType;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteTrigger = async () => {
    if (!trigger.id) return;
    setLoading(true);
    const deletedTrigger = await workflowNodeDeleteById(trigger.id);

    if (deletedTrigger.success) {
      queryClient.invalidateQueries({
        queryKey: ["adminTriggers"],
      });
      toast.success(deletedTrigger.success);
    } else toast.error(deletedTrigger.error);

    setAlertOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteTrigger}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Trigger"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <TriggerForm
          trigger={trigger as WorkflowTriggerSchemaType}
          onClose={() => setIsOpen(false)}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm gap-2">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {trigger.name}
        </h3>

        <CardData label="Type" value={trigger.type} />
        <CardData label="Data" value={JSON.stringify(trigger.data)} />
        <CardData label="Date Created" value={formatDate(trigger.createdAt)} />
        <CardData label="Date Updated" value={formatDate(trigger.updatedAt)} />
        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
            size="icon"
          >
            <Trash size={15} />
          </Button>

          <Button onClick={() => setIsOpen(true)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
