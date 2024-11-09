"use client";
import { useScriptActions, useScriptStore } from "@/hooks/admin/use-script";

import { Script } from "@prisma/client";

import { AlertModal } from "@/components/modals/alert";
import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";

import { formatDate } from "@/formulas/dates";

type Props = {
  script: Script;
};
export const ScriptCard = ({ script }: Props) => {
  const { alertOpen, setAlertOpen, onScriptDelete, isPendingScriptDelete } =
    useScriptActions();
  const { onScriptFormOpen } = useScriptStore();

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => onScriptDelete(script.id)}
        loading={isPendingScriptDelete}
        height="auto"
      />

      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">
          {script.name}
        </h3>
        <CardData label="Type" value={script.type} />
        <CardData label="Description" value={script.content as string} />
        <CardData label="Date Created" value={formatDate(script.createdAt)} />
        <CardData label="Date Updated" value={formatDate(script.updatedAt)} />
        <div className="flex group gap-2 justify-end items-center mt-auto border-t pt-2">
          <Button
            variant="destructive"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={() => onScriptFormOpen(script.id)}>Edit</Button>
        </div>
      </div>
    </>
  );
};
