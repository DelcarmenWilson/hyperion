"use client";
import { useState } from "react";

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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { pipelineInsert } from "@/actions/pipeline";
import { usePhoneContext } from "@/providers/phone-provider";
import { RefreshCcw } from "lucide-react";

export const TopMenu = () => {
  const { leadStatus } = usePhoneContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(
    leadStatus ? leadStatus[0].status : "New"
  );

  const onStageInsert = () => {
    if (!title || !status) return;
    setLoading(true);
    pipelineInsert(status, title).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
      setLoading(false);
    });
  };

  return (
    <div className="flex gap-2 mr-6">
      <Button size="sm" onClick={() => router.refresh()}>
        <RefreshCcw className="w-4 h-4" />
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Add stage</Button>
        </DialogTrigger>
        <DialogContent className="p-4 max-h-[96%] max-w-max bg-background">
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
                <SelectValue placeholder="Select a status a Team" />
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
            Change
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
