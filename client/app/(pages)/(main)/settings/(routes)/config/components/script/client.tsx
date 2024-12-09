"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useScriptData, useScriptStore } from "@/hooks/admin/use-script";

import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { ScriptList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const ScriptClient = () => {
  const user = useCurrentUser();
  const { onGetScripts } = useScriptData();
  const { scripts, scriptsFetching } = onGetScripts();
  const { onScriptFormOpen } = useScriptStore();
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={scriptsFetching}>
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
        <SkeletonWrapper isLoading={scriptsFetching}>
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
