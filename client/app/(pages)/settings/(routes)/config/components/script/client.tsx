"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useScriptData, useScriptStore } from "@/hooks/admin/use-script";

import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { ScriptList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ScriptClient = () => {
  const user = useCurrentUser();
  const { scripts, isFetchingScripts } = useScriptData();
  const { onScriptFormOpen, onScriptFormClose } = useScriptStore();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingScripts}>
      <ListGridTopMenu
        text="Add Script"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={onScriptFormOpen}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      {isList ? (
        <SkeletonWrapper isLoading={isFetchingScripts}>
          <DataTable
            columns={columns}
            data={scripts || []}
            // data={scripts?.filter((e) => e.type != "default")!}
            headers
            title="Scripts"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Lead Status</h4>
            {topMenu}
          </div>
          <ScriptList />
        </>
      )}
    </>
  );
};
