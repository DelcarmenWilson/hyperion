import { useState } from "react";
import { useGlobalContext } from "@/providers/global";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Reorder, useDragControls } from "framer-motion";

import { FullLead, FullPipeline } from "@/types";

import { PipeLine } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { DropResult } from "react-beautiful-dnd";

import { PipelineCard } from "./card";

import {
  pipelineDeleteById,
  pipelineUpdateById,
  pipelineUpdateOrder,
} from "@/actions/pipeline";

type PipeLineListProps = {
  leads: FullLead[];
  initPipelines: FullPipeline[];
};
export const PipeLineList = ({ leads, initPipelines }: PipeLineListProps) => {
  const [pipelines, setPipelines] = useState(initPipelines);

  const { leadStatus } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [alertOpen, setAlertOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pipeline, setPipeline] = useState<PipeLine | null>();

  const sendPipeline = (e: PipeLine, type: string) => {
    setPipeline(e);
    if (type == "alert") setAlertOpen(true);
    else setDialogOpen(true);
  };

  //TODO - need to refactor the next 2 function - possible uniting the create and edit forms
  const setStatus = (e: string) => {
    if (!pipeline) return;
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

  const onPipelineUpdate = async () => {
    if (!pipeline) return;
    if (!pipeline.name) {
      toast.error("title cannot be empty");
    }
    setLoading(true);
    const updatedPipeline = await pipelineUpdateById(pipeline);

    if (updatedPipeline.success) {
      router.refresh();
      toast.success(updatedPipeline.success);
    } else toast.error(updatedPipeline.error);

    setPipeline(null);
    setDialogOpen(false);
    setLoading(false);
  };

  const onDelete = async () => {
    if (!pipeline) return;
    setLoading(true);
    const deletePipeline = await pipelineDeleteById(pipeline.id);
    if (deletePipeline.success) {
      router.refresh();
      toast.success(deletePipeline.success);
    } else toast.error(deletePipeline.error);

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
    const updatePipeline = await pipelineUpdateOrder(list);
    if (updatePipeline.success) {
      toast.success(updatePipeline.success);
      router.refresh();
    } else toast.error(updatePipeline.error);
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogDescription className="hidden">
          Pipeline List Form
        </DialogDescription>
        <DialogContent className="flex flex-col justify-start h-[60%] w-full">
          <h3 className="text-2xl font-semibold py-2">Edit Stage</h3>
          <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
            <p className="text-base text-muted-foreground xl:min-w-12">
              Status
            </p>
            <Select
              name="ddlStatus"
              disabled={loading}
              onValueChange={setStatus}
              defaultValue={pipeline?.statusId}
            >
              <SelectTrigger>
                <SelectValue placeholder="New status" />
              </SelectTrigger>
              <SelectContent>
                {leadStatus?.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
            <p className="text-base text-muted-foreground xl:min-w-12">Title</p>
            <Input
              disabled={loading}
              placeholder="New leads"
              value={pipeline?.name as string}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button disabled={loading} onClick={onPipelineUpdate}>
            Update
          </Button>
        </DialogContent>
      </Dialog>
      <Reorder.Group
        className="flex gap-4 overflow-x-auto w-full h-full"
        values={pipelines}
        onReorder={setPipelines}
      >
        {pipelines?.map((pipeline, index) => (
          <PipelineCard
            key={pipeline.id}
            idx={index}
            pipeline={pipeline}
            sendPipeline={sendPipeline}
            initLeads={leads.filter((e) => e.status == pipeline.status.status)}
          />
        ))}
      </Reorder.Group>
    </>
  );
};
