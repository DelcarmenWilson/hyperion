"use client";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAgentTemplateData } from "../../hooks/user-template";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

import { TemplateForm } from "./form";
import { TemplateList } from "./list";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const UserTemplateClient = () => {
  const user = useCurrentUser();
  const { templates, isFetchingTemplates } = useAgentTemplateData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(user?.dataStyle == "list");
  const topMenu = (
    <SkeletonWrapper isLoading={isFetchingTemplates}>
      <ListGridTopMenu
        text="Add Template"
        isList={isList}
        setIsList={setIsList}
        setIsDrawerOpen={() => setIsDrawerOpen(true)}
      />
    </SkeletonWrapper>
  );

  return (
    <>
      <DrawerRight
        title={"New Template"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <TemplateForm onClose={() => setIsDrawerOpen(false)} />
      </DrawerRight>

      {isList ? (
        <SkeletonWrapper isLoading={isFetchingTemplates}>
          <DataTable
            columns={columns}
            data={templates || []}
            headers
            title="Templates"
            topMenu={topMenu}
          />
        </SkeletonWrapper>
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Templates</h4>
            {topMenu}
          </div>
          <TemplateList />
        </>
      )}
    </>
  );
};
