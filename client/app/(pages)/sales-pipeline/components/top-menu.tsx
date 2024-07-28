"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userEmitter } from "@/lib/event-emmiter";
import { Cog, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useGlobalContext } from "@/providers/global";

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
import { pipelineInsert } from "@/actions/pipeline";
import { StageList } from "./stage-list";

export const TopMenu = ({ pipelines }: { pipelines: FullPipeline[] }) => {
  const { leadStatus } = useGlobalContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].id : undefined
  );

  const [stagesOpen, setStagesOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);

  const onStageInsert = () => {
    if (!title || !status) {
      toast.error("Title is required!");
      return;
    }
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

  const onRefresh = () => {
    router.refresh();
  };

  useEffect(() => {
    userEmitter.on("leadStatusChanged", () => onRefresh());
  }, []);

  return (
    <div className="flex gap-2 ml-auto mr-6 lg:mr-0">
      <Button size="sm" onClick={onRefresh}>
        <RefreshCcw size={16} />
      </Button>
      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Add stage</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col justify-start h-[60%] w-full">
          <h3 className="text-2xl font-semibold py-2">Add Stage</h3>
          <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
            <p className="text-base text-muted-foreground xl:min-w-12">
              Status
            </p>

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
          </div>
          <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center">
            <p className="text-base text-muted-foreground xl:min-w-12">Title</p>
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
          <StageList
            pipelines={pipelines}
            setStagesOpen={() => setStagesOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
