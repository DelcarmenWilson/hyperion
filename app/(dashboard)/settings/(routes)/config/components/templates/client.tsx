"use client";
import { useEffect, useState } from "react";
import { emitter } from "@/lib/event-emmiter";

import { useGlobalContext } from "@/providers/global";
import { UserTemplate } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ListGridTopMenu } from "@/components/reusable/list-grid-top-menu";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";

import { TemplateForm } from "./form";
import { TemplateList } from "./list";

export const UserTemplateClient = () => {
  const { templates, setTemplates } = useGlobalContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isList, setIsList] = useState(false);

  useEffect(() => {
    const onTemplateDeleted = (id: string) => {
      setTemplates((templates) => {
        if (!templates) return templates;
        return templates.filter((e) => e.id !== id);
      });
    };
    const onTemplateInserted = (newTemplate: UserTemplate) => {
      const existing = templates?.find((e) => e.id == newTemplate.id);
      if (existing == undefined)
        setTemplates((templates) => [...templates!, newTemplate]);
    };

    const onTemplateUpdated = (updatedTemplate: UserTemplate) => {
      setTemplates((templates) => {
        if (!templates) return templates;
        return templates
          .filter((e) => e.id != updatedTemplate.id)
          .concat(updatedTemplate);
      });
    };

    return () => {
      emitter.on("templateDeleted", (id) => onTemplateDeleted(id));
      emitter.on("templateInserted", (info) => onTemplateInserted(info));
      emitter.on("templateUpdated", (info) => onTemplateUpdated(info));
    };
  }, []);
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
        <DataTable
          columns={columns}
          data={templates!}
          headers
          title="Templates"
          topMenu={
            <ListGridTopMenu
              text="Add Template"
              isList={isList}
              setIsList={setIsList}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          }
        />
      ) : (
        <>
          <div className="flex justify-between items-center p-1">
            <h4 className="text-2xl font-semibold">Templates</h4>
            <ListGridTopMenu
              text="Add Template"
              setIsDrawerOpen={setIsDrawerOpen}
              isList={isList}
              setIsList={setIsList}
            />
          </div>
          <TemplateList templates={templates!} />
        </>
      )}
    </>
  );
};
