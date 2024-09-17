"use client";
import { Plus } from "lucide-react";
import { useScriptActions, useScriptData } from "@/hooks/admin/use-script";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ScriptsClient = () => {
  const { scripts, isFetchingScripts, scriptId, setScriptId } = useScriptData();
  const { onScriptInsert, isPendingScriptInsert } = useScriptActions();

  return (
    <div className="flex flex-col w-full gap-2 border-r px-4">
      <div className="flex justify-between items-center gap-2">
        <h4 className="text-xl font-semibold">Scripts</h4>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPendingScriptInsert}
          onClick={onScriptInsert}
        >
          <Plus size={16} />
        </Button>
      </div>
      <SkeletonWrapper isLoading={isFetchingScripts}>
        {scripts?.map((script) => (
          <Button
            key={script.id}
            variant={script.id == scriptId ? "default" : "ghost"}
            onClick={() => setScriptId(script.id)}
          >
            {script.title}
          </Button>
        ))}
      </SkeletonWrapper>
    </div>
  );
};
