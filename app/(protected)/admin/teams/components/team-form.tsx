"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { teamInsert } from "@/actions/team";

export const TeamForm = () => {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const onTeamInsert = () => {
    if (!teamName) {
      toast.error("team name cannot be empty!");
      return;
    }
    setLoading(true);
    teamInsert(teamName).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
        setTeamName("");
        router.refresh();
      }
    });
    setLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">New Team</Button>
      </DialogTrigger>
      <DialogContent className="p-4 max-h-[96%] max-w-max bg-background">
        <h3 className="text-2xl font-semibold py-2">Create Team</h3>
        <div>
          <p className="text-muted-foreground">Create a New Team</p>
          <Input
            disabled={loading}
            placeholder="Team Name"
            onChange={(e) => setTeamName(e.target.value)}
            value={teamName}
          />
        </div>
        <Button disabled={loading} onClick={onTeamInsert}>
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};
