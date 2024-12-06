"use client";
import { Shield } from "lucide-react";
import { useTeamActions } from "@/hooks/use-team";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const CreateTeamDialog = ({ enabled = false }: { enabled?: boolean }) => {
  const {
    isFormOpen,
    setFormOpen,
    teamName,
    setTeamName,
    onTeamInsert,
    teamIsPending,
  } = useTeamActions();

  if (!enabled) return null;

  return (
    <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
      <DialogTrigger asChild>
        <Button>{"Create Team"}</Button>
      </DialogTrigger>
      <DialogContent>
        <CustomDialogHeader
          icon={Shield}
          title="Create Team"
          subTitle="Add a new Team to the organization"
        />
        <div>
          <Input
            disabled={teamIsPending}
            placeholder="Team Name"
            onChange={(e) => setTeamName(e.target.value)}
            value={teamName}
          />
          <p className="text-muted-foreground text-xs">
            * name must be unique within your organization.
          </p>
        </div>
        <Button
          className="mt-auto"
          disabled={teamIsPending}
          onClick={onTeamInsert}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;
