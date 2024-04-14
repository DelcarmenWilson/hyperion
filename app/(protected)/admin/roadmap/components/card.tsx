"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Roadmap } from "@prisma/client";

import { DrawerRight } from "@/components/custom/drawer-right";

import { toast } from "sonner";
import { format } from "date-fns";
import { getAge } from "@/formulas/dates";
import { AlertModal } from "@/components/modals/alert";
import { CardData } from "@/components/reusable/card-data";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { RoadmapForm } from "./form";

type RoadmapCardProps = {
  initRoadmap: Roadmap;
  onRoadmapDeleted: (e: string) => void;
};

export const RoadmapCard = ({
  initRoadmap,
  onRoadmapDeleted,
}: RoadmapCardProps) => {
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [roadmap, setRoadmap] = useState(initRoadmap);

  const onRoadmapUpdated = (e?: Roadmap) => {
    if (e) setRoadmap(e);
    setIsOpen(false);
  };

  const onDeleteRoadmap = () => {
    setLoading(true);
    // leadBeneficiaryDeleteById(roadmap.id).then((data) => {
    //   if (data.error) {
    //     toast.error(data.error);
    //   }
    //   if (data.success) {
    //     onRoadmapDeleted(roadmap.id);
    //     toast.success(data.success);
    //   }
    // });
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        title="Want to delete this task"
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDeleteRoadmap}
        loading={loading}
        height="h-200"
      />
      <DrawerRight
        title="Edit Task"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <RoadmapForm roadmap={roadmap} onClose={onRoadmapUpdated} />
      </DrawerRight>
      <div className="flex flex-col border rounded-xl p-2 overflow-hidden text-sm">
        <h3 className="text-2xl text-primary font-semibold text-center">{`${roadmap.headLine}`}</h3>
        <CardData title="Status" value={roadmap.status} />

        <CardData title="Description" value={roadmap.description} column />
        <CardData title="Published" value={roadmap.published.toString()} />

        <CardData
          title="Start Date"
          value={format(roadmap.startAt, "MM-dd-yy")}
        />
        <CardData title="End Date" value={format(roadmap.endAt, "MM-dd-yy")} />

        <div className="flex group gap-2 justify-end items-center  mt-auto pt-2 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => setAlertOpen(true)}
          >
            <Trash size={16} />
          </Button>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            <Edit size={16} />
          </Button>
          <Button size="sm" asChild>
            <Link href={`/admin/roadmap/${roadmap.id}`}>Details</Link>
          </Button>
        </div>
      </div>
    </>
  );
};
