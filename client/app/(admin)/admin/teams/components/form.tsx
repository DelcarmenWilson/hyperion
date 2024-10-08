"use client";
import { useTeamActions } from "../hooks/use-team";

import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";
import { Input } from "@/components/ui/input";

type Props = { enabled?: boolean };
export const TeamForm = ({ enabled = false }: Props) => {
  const {
    isFormOpen,
    setFormOpen,
    teamName,
    setTeamName,
    onTeamInsert,
    teamIsPending,
  } = useTeamActions();

  return (
    <>
      {enabled && (
        <Button size="sm" onClick={() => setFormOpen(true)}>
          New Team
        </Button>
      )}

      <CustomDialog
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        title="Create Team"
        description="New Team Form"
      >
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
      </CustomDialog>
    </>
  );
};
