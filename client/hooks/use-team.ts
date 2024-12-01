import { useCallback, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { FullTeam } from "@/types";

import {
  getTeam,
  createTeam,
  getTeams,
  getTeamsForOrganization,
} from "@/actions/team";
import { useInvalidate } from "@/hooks/use-invalidate";
import { Team } from "@prisma/client";

export const useTeamData = () => {
  const { teamId } = useTeamId();
  //TEAMS
  const onGetTeams = () => {
    const {
      data: teams,
      isFetching: teamsFetching,
      isLoading: teamsLoading,
    } = useQuery<FullTeam[] | []>({
      queryFn: () => getTeams(),
      queryKey: ["teams"],
    });
    return {
      teams,
      teamsFetching,
      teamsLoading,
    };
  };
//TEAMS FOR ORGANIZATION
  const onGetTeamsForOrganization = (organizationId:string) => {
    const {
      data: teams,
      isFetching: teamsFetching,
      isLoading: teamsLoading,
    } = useQuery<Team[] | []>({
      queryFn: () => getTeamsForOrganization(organizationId),
      queryKey: [`teams-${organizationId}`],
      enabled:!!organizationId
    });
    return {
      teams,
      teamsFetching,
      teamsLoading,
    };
  };

  //TEAM
  const onGetTeam = () => {
    const {
      data: team,
      isFetching: teamFetching,
      isLoading: teamLoading,
    } = useQuery<FullTeam | null>({
      queryFn: () => getTeam(teamId),
      queryKey: [`team-${teamId}`],
      enabled: !teamId,
    });
    return {
      team,
      teamFetching,
      teamLoading,
    };
  };

  return {
    onGetTeams,
    onGetTeamsForOrganization,
    onGetTeam
  };
};

export const useTeamActions = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { invalidate } = useInvalidate();

  //TEAMS
  const { mutate: teamInsertMutate, isPending: teamIsPending } = useMutation({
    mutationFn: createTeam,
    onSuccess: (result) => {
      toast.success("Team Created", { id: "create-team" });
      setFormOpen(false);
      invalidate("teams");
    },
    onError: (error) => toast.error(error.message, { id: "create-team" }),
  });

  const onTeamInsert = useCallback(() => {
    toast.loading("Creating New Team", { id: "create-team" });
    if (!teamName) {
      toast.error("Team name cannot be empty!", { id: "create-team" });
      return;
    }
    teamInsertMutate(teamName);
  }, [teamInsertMutate]);

  return {
    isFormOpen,
    setFormOpen,
    teamName,
    setTeamName,
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
