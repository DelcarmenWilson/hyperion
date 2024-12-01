"use client";
import React, { useState } from "react";
import { Users } from "lucide-react";
import { useTeamData } from "@/hooks/use-team";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  organizationId: string | undefined;
  defaultValue: string;
  onChange: (teamId: string) => void;
};

const UpdateTeamDialog = ({
  organizationId,
  defaultValue,
  onChange,
}: Props) => {
  const [team, setTeam] = useState(defaultValue);
  const { onGetTeamsForOrganization } = useTeamData();
  const { teams, teamsFetching } = onGetTeamsForOrganization(
    organizationId as string
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="opacity-0 group-hover:opacity-100">
          <span className="sr-only">Update Team</span>
          <span>Update</span>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="Update Team dialog">
        <CustomDialogHeader icon={Users} title="Update Team" />
        <div>
          <p className="text-muted-foreground">Select a New Team</p>

          <Select
            name="ddlTeam"
            disabled={teamsFetching}
            onValueChange={setTeam}
            defaultValue={defaultValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Team" />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={defaultValue == team || teamsFetching}
          onClick={() => onChange(team as string)}
        >
          Change
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTeamDialog;
