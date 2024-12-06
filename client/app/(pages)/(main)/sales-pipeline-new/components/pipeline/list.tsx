import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Reorder } from "framer-motion";

import { FullLead, FullPipeline } from "@/types";

import { Pipeline } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert";
import { DropResult } from "react-beautiful-dnd";

import { PipelineCard } from "./card";

import {
  deletedPipeline,
  updatePipeline,
  updatePipelineOrder,
} from "@/actions/user/pipeline";

type PipeLineListProps = {
  leads: FullLead[];
  initPipelines: FullPipeline[];
};
export const PipeLineList = ({ leads, initPipelines }: PipeLineListProps) => {
  const [pipelines, setPipelines] = useState(initPipelines);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pipeline, setPipeline] = useState<Pipeline | null>();

  const sendPipeline = (e: Pipeline, type: string) => {
    setPipeline(e);
    if (type == "alert") setAlertOpen(true);
    else setDialogOpen(true);
  };

  //TODO - need to refactor the next 2 function - possible uniting the create and edit forms
  const setStatus = (e: string | undefined) => {
    if (!e || !pipeline) return;
    setPipeline({
      ...pipeline,
      statusId: e,
    });
  };
  const setTitle = (e: string) => {
    if (!pipeline) return;
    setPipeline({
      ...pipeline,
      name: e,
    });
  };

  const onDelete = async () => {
    if (!pipeline) return;
    setLoading(true);
    await deletedPipeline(pipeline.id);

    router.refresh();
    toast.success("Pipeline delete");

    setPipeline(null);
    setAlertOpen(false);
    setLoading(false);
  };

  const onDragDrop = async (results: DropResult) => {
    if (!results.destination) return;
    const items = Array.from(pipelines);
    const [reorderedItem] = items.splice(results.source.index, 1);

    items.splice(results.destination.index, 0, reorderedItem);
    setPipelines(items);

    const list: { id: string; order: number }[] = items.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    //TODO - see if this can be consolidated with the function in the stage list
    await updatePipelineOrder(list);

    toast.success("Pipeline update");
    router.refresh();
  };
  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        height="h-auto"
      />

      <Reorder.Group values={pipelines} onReorder={setPipelines}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {pipelines?.map((pipeline, index) => (
            <PipelineCard
              key={pipeline.id}
              idx={index}
              pipeline={pipeline}
              sendPipeline={sendPipeline}
              initLeads={leads.filter((e) => e.statusId == pipeline.statusId)}
            />
          ))}
        </div>
      </Reorder.Group>
    </>
  );
};
