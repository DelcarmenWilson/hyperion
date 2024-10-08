import { useCallback, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullTeam } from "@/types";

import { teamGetById, teamInsert, teamsGetAll } from "@/actions/team";

export const useTeamData = () => {
  const { teamId } = useTeamId();
  //TEAMS
  const { data: teams, isFetching: isFetchingTeams } = useQuery<
    FullTeam[] | []
  >({
    queryFn: () => teamsGetAll(),
    queryKey: ["teams"],
  });

  const { data: team, isFetching: isFetchingTeam } = useQuery<FullTeam | null>({
    queryFn: () => teamGetById(teamId),
    queryKey: [`team-${teamId}`],
  });

  return {
    teams,
    isFetchingTeams,
    team,
    isFetchingTeam,
  };
};

export const useTeamActions = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  //TEAMS
  const { mutate: teamInsertMutate, isPending: teamIsPending } = useMutation({
    mutationFn: teamInsert,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Team Created", { id: "insert-team" });
        setFormOpen(false);
        invalidate();
      } else toast.error(result.error, { id: "insert-team" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onTeamInsert = useCallback(
    () => {
      toast.loading("Creating New Team", { id: "insert-team" });
      if (!teamName) {
        toast.error("Team name cannot be empty!", { id: "insert-team" });
        return;
      }
      teamInsertMutate(teamName);
    },
    [teamInsertMutate]
  );

  return {
    
    isFormOpen,
    setFormOpen,teamName, setTeamName,
    onTeamInsert,
    teamIsPending,
  };
};

export const useTeamId = () => {
  const params = useParams();
  const teamId = useMemo(() => {
    if (!params?.teamid) return "";
    return params?.teamid as string;
  }, [params?.teamid]);
  return useMemo(() => ({ teamId }), [teamId]);
};
