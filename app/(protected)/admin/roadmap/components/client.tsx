"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

import { DrawerRight } from "@/components/custom/drawer-right";
import { DataTable } from "@/components/tables/data-table";
import { Roadmap } from "@prisma/client";
import { Button } from "@/components/ui/button";

import { RoadmapForm } from "./form";
import { columns } from "./columns";
import { RoadmapList } from "./list";

type RoadmapClientProps = {
  initRoadmaps: Roadmap[];
};

export const RoadmapClient = ({ initRoadmaps }: RoadmapClientProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [roadmaps, setRoadmaps] = useState(initRoadmaps);
  const onRoadmapCreated = (e?: Roadmap) => {
    if (e) {
      setRoadmaps((roadmaps) => {
        return [...roadmaps, e];
      });
    }
    setIsDrawerOpen(false);
  };
  return (
    <>
      <DrawerRight
        title={"New Roadmap"}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <RoadmapForm onClose={onRoadmapCreated} />
      </DrawerRight>
      <div className=" text-end mb-2">
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} className="mr-2" /> New Task
        </Button>
      </div>
      <RoadmapList initRoadmaps={roadmaps} />
      {/* <DataTable
        columns={columns}
        data={roadmaps}
        headers
        topMenu={
          <div className="col-span-3 text-end">
            <Button onClick={() => setIsDrawerOpen(true)}>
              <Plus size={16} className="mr-2" /> New Task
            </Button>
          </div>
        }
      /> */}
    </>
  );
};
