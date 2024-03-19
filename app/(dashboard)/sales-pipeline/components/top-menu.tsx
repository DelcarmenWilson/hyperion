"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Cog, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { FullPipeline } from "@/types";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pipelineInsert, pipelineUpdateOrder } from "@/actions/pipeline";
import { useGlobalContext } from "@/providers/global";

type TopMenuProps = {
  pipelines: FullPipeline[];
};

export const TopMenu = ({ pipelines }: TopMenuProps) => {
  const { leadStatus } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].status : "New"
  );
  const [stages, setStages] = useState(pipelines);

  const [stagesOpen, setStagesOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  const onStageInsert = () => {
    if (!title || !status) return;
    setLoading(true);
    pipelineInsert(status, title).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setStageOpen(false);
        router.refresh();
      }
      setLoading(false);
    });
  };

  const onOrdered = (id: string, order: string) => {
    setStages((st) => {
      let oldIndex = st.findIndex((e) => e.id == id);
      let newIndex = oldIndex;
      if (order == "down") {
        newIndex += 1;
      } else {
        newIndex -= 1;
      }

      st.splice(newIndex, 0, st.splice(oldIndex, 1)[0]);
      return [...st];
    });
  };

  const onStageUpdate = () => {
    const list: { id: string; order: number }[] = stages.map(
      (stage, index) => ({
        id: stage.id,
        order: index,
      })
    );
    setLoading(true);
    pipelineUpdateOrder(list).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setStagesOpen(false);
        router.refresh();
      }
      setLoading(false);
    });
    // toast.success(JSON.stringify(list));
  };

  return (
    <div className="flex gap-2 mr-6">
      <Button size="sm" onClick={() => router.refresh()}>
        <RefreshCcw className="w-4 h-4" />
      </Button>
      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Add stage</Button>
        </DialogTrigger>
        <DialogContent>
          <h3 className="text-2xl font-semibold py-2">Add Stage</h3>
          <div>
            <p className="text-muted-foreground">Select a Status</p>

            <Select
              name="ddlStatus"
              disabled={loading}
              onValueChange={setStatus}
              defaultValue={status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status " />
              </SelectTrigger>
              <SelectContent>
                {leadStatus?.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground">Stage title</p>
            <Input
              disabled={loading}
              placeholder="New leads"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button disabled={loading} onClick={onStageInsert}>
            Add
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={stagesOpen} onOpenChange={setStagesOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <Cog size={16} className="mr-2" /> Config
          </Button>
        </DialogTrigger>
        <DialogContent className="p-4 max-h-[96%]  max-w-screen-md bg-background">
          <h3 className="text-2xl font-semibold py-2">Organize you pipeline</h3>
          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground border-b items-center">
            <p>Status</p>
            <p>Title</p>
            <p>Created at</p>
            <p>Action</p>
          </div>
          {stages.map((pipeline, index) => (
            <div
              key={pipeline.id}
              className="grid grid-cols-4 gap-2 text-sm border-b items-center"
            >
              <p>{pipeline.status.status}</p>
              <p>{pipeline.name}</p>
              <p>{format(pipeline.createdAt, "MM-dd-yy")}</p>
              <div className="flex gap-2 items-center">
                <Button
                  disabled={index == stages.length - 1}
                  size="xs"
                  onClick={() => onOrdered(pipeline.id, "down")}
                >
                  <ChevronDown size={16} />
                </Button>
                <Button
                  disabled={index == 0}
                  size="xs"
                  onClick={() => onOrdered(pipeline.id, "up")}
                >
                  <ChevronUp size={16} />
                </Button>
              </div>
            </div>
          ))}

          <Button disabled={pipelines == stages} onClick={onStageUpdate}>
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
