"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PipelineCard } from "./card";
import { FullLead, FullPipeline } from "@/types";
import { PipeLine } from "@prisma/client";
import { AlertModal } from "@/components/modals/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { pipelineDeleteById, pipelineUpdateById } from "@/actions/pipeline";
import { Input } from "@/components/ui/input";
import { useGlobalContext } from "@/providers/global";

type SaleClientProps = {
  data: FullLead[];
  pipelines: FullPipeline[];
};

export const SalesClient = ({ data, pipelines }: SaleClientProps) => {
  const { leadStatus } = useGlobalContext();

  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const router = useRouter();
  const [pipeline, setPipeline] = useState<PipeLine | null>();

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

  const sendPipeline = (e: PipeLine, type: string) => {
    setPipeline(e);
    if (type == "alert") {
      setAlertOpen(true);
    } else {
      setUpdateOpen(true);
    }
  };

  const onPipelineUpdate = () => {
    if (!pipeline) return;
    if (!pipeline.name) {
      toast.error("title cannot be empty");
    }
    setLoading(true);
    pipelineUpdateById(pipeline).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
    });
    setPipeline(null);
    setUpdateOpen(false);
    setLoading(false);
  };

  const onDelete = () => {
    if (!pipeline) return;
    setLoading(true);
    pipelineDeleteById(pipeline.id).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
    });
    setPipeline(null);
    setAlertOpen(false);
    setLoading(false);
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
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {pipelines?.map((pipeline) => (
          <PipelineCard
            key={pipeline.id}
            pipeline={pipeline}
            sendPipeline={sendPipeline}
            leads={data.filter((e) => e.status == pipeline.status.status)}
          />
        ))}
      </div>
    </>
  );
};
