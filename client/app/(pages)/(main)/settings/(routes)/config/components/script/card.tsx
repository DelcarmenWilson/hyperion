"use client";
import { useScriptStore } from "@/stores/script-store";
import { useScriptActions } from "@/hooks/admin/use-script";
import { Script } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import DeleteDialog from "@/components/custom/delete-dialog";

import { formatDate } from "@/formulas/dates";

export const ScriptCard = ({ script }: { script: Script }) => {
  const { onDeleteScript, scriptDeleting } = useScriptActions();
  const { onScriptFormOpen } = useScriptStore();

  return (
    <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
      <h3 className="text-2xl text-primary font-semibold text-center">
        {script.name}
      </h3>
      <CardData label="Type" value={script.type} />
      <CardData label="Description" value={script.content as string} />
      <CardData label="Date Created" value={formatDate(script.createdAt)} />
      <CardData label="Date Updated" value={formatDate(script.updatedAt)} />
      <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
        <DeleteDialog
          title="script"
          cfText="Delete"
          onConfirm={() => onDeleteScript(script.id)}
          loading={scriptDeleting}
        />

        <Button onClick={() => onScriptFormOpen(script.id)}>Edit</Button>
      </div>
    </div>
  );
};
