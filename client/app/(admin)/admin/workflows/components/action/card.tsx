"use client";
import { useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { WorkflowActionSchemaType } from "@/schemas/workflow/action";
import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer-right";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";

import { ActionForm } from "./form";

import { formatDate } from "@/formulas/dates";
import { workflowNodeDeleteById } from "@/actions/workflow/default";

export const ActionCard = ({
  action,
}: {
  action: WorkflowActionSchemaType;
}) => {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onDeleteAction = async () => {
    if (!action.id) return;
    setLoading(true);
    const deletedAction = await workflowNodeDeleteById(action.id);

    if (deletedAction.success) {
      queryClient.invalidateQueries({
        queryKey: ["adminActions"],
      });
      toast.success(deletedAction.success);
    } else toast.error(deletedAction.error);

    setAlertOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteAction}
        loading={loading}
        height="auto"
      />
      <DrawerRight
        title="Edit Action"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ActionForm
          action={action as WorkflowActionSchemaType}
          onClose={() => setIsOpen(false)}
        />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm gap-2">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {action.name}
        </h3>

        <CardData label="Type" value={action.type} />
        <CardData label="Data" value={JSON.stringify(action.data)} />
        <CardData label="Date Created" value={formatDate(action.createdAt)} />
        <CardData label="Date Updated" value={formatDate(action.updatedAt)} />
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
