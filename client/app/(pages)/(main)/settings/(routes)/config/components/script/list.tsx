"use client";
import { cn } from "@/lib/utils";
import { useScriptData } from "@/hooks/admin/use-script";

import { ScriptCard } from "./card";
import SkeletonWrapper from "@/components/skeleton-wrapper";
import { EmptyData } from "@/components/lead/info/empty-data";

type Props = {
  size?: string;
};
export const ScriptList = ({ size = "full" }: Props) => {
  const { onGetScripts } = useScriptData();
  const { scripts, scriptsFetching } = onGetScripts();
  return (
    <SkeletonWrapper isLoading={scriptsFetching}>
      {scripts?.length ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-2 overflow-y-auto",
            size == "full" && "lg:grid-cols-4"
          )}
        >
          {scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      ) : (
        <EmptyData title="No Lead Status Found<" />
      )}
    </SkeletonWrapper>
  );
};
