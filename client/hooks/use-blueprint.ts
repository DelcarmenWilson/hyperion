import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useInvalidate } from "./use-invalidate";

import { AgentWorkInfo, BluePrint, BluePrintWeek } from "@prisma/client";
import {
  UpdateBluePrintWeekSchemaType,
  CreateAgentWorkInfoSchemaType,
  UpdateAgentWorkInfoSchemaType,
} from "@/schemas/blueprint";

import { getActiveBlueprint, getBlueprints } from "@/actions/blueprint/index";

import {
  createAgentWorkInfo,
  getAgentWorkInfo,
  updateAgentWorkInfo,
} from "@/actions/blueprint/agent-work-info";

import {
  createNewBlueprintWeek,
  getActiveBluePrintWeek,
  getBluePrintWeeksReport,
  getBluePrintWeeks,
  updateBluePrintWeek,
} from "@/actions/blueprint/week";

export const useBluePrintData = () => {
  const onGetAgentWorkInfo = () => {
    const {
      data: agentWorkInfo,
      isFetching: agentWorkInfoFetching,
      isLoading: agentWorkInfoLoading,
    } = useQuery<AgentWorkInfo | null>({
      queryFn: () => getAgentWorkInfo(),
      queryKey: ["blueprint-work-info"],
    });
    return { agentWorkInfo, agentWorkInfoFetching, agentWorkInfoLoading };
  };

  const onGetBluePrints = () => {
    const {
      data: bluePrints,
      isFetching: bluePrintsFetching,
      isLoading: bluePrintsLoading,
    } = useQuery<BluePrint[]>({
      queryFn: () => getBlueprints(),
      queryKey: ["blueprints"],
    });
    return {
      bluePrints,
      bluePrintsFetching,
      bluePrintsLoading,
    };
  };

  const onGetBluePrintWeekActive = () => {
    const {
      data: bluePrintWeekActive,
      isFetching: bluePrintWeekActiveFetching,
      isLoading: bluePrintWeekActiveLoading,
    } = useQuery<BluePrintWeek | null>({
      queryFn: () => getActiveBluePrintWeek(),
      queryKey: ["blueprint-week-active"],
    });
    return {
      bluePrintWeekActive,
      bluePrintWeekActiveFetching,
      bluePrintWeekActiveLoading,
    };
  };

  const onGetBluePrintYearActive = () => {
    const {
      data: bluePrintYearActive,
      isFetching: bluePrintYearActiveFetching,
      isLoading: bluePrintYearActiveLoading,
    } = useQuery<BluePrint | null>({
      queryFn: () => getActiveBlueprint(),
      queryKey: ["blueprint-active"],
    });
    return {
      bluePrintYearActive,
      bluePrintYearActiveFetching,
      bluePrintYearActiveLoading,
    };
  };

  const onGetBluePrintsWeekly = () => {
    const {
      data: bluePrintsWeekly,
      isFetching: bluePrintsWeeklyFetching,
      isLoading: bluePrintsWeeklyLoading,
    } = useQuery<BluePrintWeek[]>({
      queryFn: () => getBluePrintWeeks(),
      queryKey: ["blueprints-weekly"],
    });
    return {
      bluePrintsWeekly,
      bluePrintsWeeklyFetching,
      bluePrintsWeeklyLoading,
    };
  };

  const onGetBluePrintWeekReport = () => {
    const {
      data: bluePrintWeekReport,
      isFetching: bluePrintWeeksReportFetching,
      isLoading: bluePrintWeeksReportLoading,
    } = useQuery<BluePrintWeek[]>({
      queryFn: () => getBluePrintWeeksReport(),
      queryKey: ["blueprint-weeks-report"],
    });
    return {
      bluePrintWeekReport,
      bluePrintWeeksReportFetching,
      bluePrintWeeksReportLoading,
    };
  };
  return {
    onGetAgentWorkInfo,
    onGetBluePrints,
    onGetBluePrintWeekActive,
    onGetBluePrintYearActive,
    onGetBluePrintsWeekly,
    onGetBluePrintWeekReport,
  };
};

export const useBluePrintActions = (callBack: () => void) => {
  const { invalidate, invalidateMultiple } = useInvalidate();
  //AGENT WORK INFO INSERT
  const {
    mutate: agentWorkInfoInsertMutate,
    isPending: agentWorkInfoInserting,
  } = useMutation({
    mutationFn: createAgentWorkInfo,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Agent details have been created", {
          id: "insert-blueprint-work-info",
        });
        callBack();
        invalidateMultiple([
          "blueprint-work-info",
          "blueprints",
          "blueprints-weekly",
          "blueprint-week-active",
          "blue-print-active",
        ]);
      } else toast.error(results.error, { id: "insert-blueprint-work-info" });
    },
    onError: (error) =>
      toast.error(error.message, { id: "insert-blueprint-work-info" }),
  });

  const onAgentWorkInfoInsert = useCallback(
    (values: CreateAgentWorkInfoSchemaType) => {
      toast.loading("Creating Work Info...", {
        id: "insert-blueprint-work-info",
      });
      agentWorkInfoInsertMutate(values);
    },
    [agentWorkInfoInsertMutate]
  );

  //AGENT WORK INFO UPDATE
  const {
    mutate: agentWorkInfoUpdateMutate,
    isPending: agentWorkInfoUpdating,
  } = useMutation({
    mutationFn: updateAgentWorkInfo,
    onSuccess: (results) => {
      invalidate("blueprint-work-info");
      callBack();
      toast.success("Agent details have been updated", {
        id: "update-agent-work-info",
      });
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-agent-work-info" }),
  });

  const onAgentWorkInfoUpdate = useCallback(
    (values: UpdateAgentWorkInfoSchemaType) => {
      toast.loading("Updating Work Info...", { id: "update-agent-work-info" });
      agentWorkInfoUpdateMutate(values);
    },
    [agentWorkInfoUpdateMutate]
  );

  //BLUE PRINT WEEK UPDATE
  const {
    mutate: bluePrintWeekUpdateMutate,
    isPending: bluePrintWeekUpdating,
  } = useMutation({
    mutationFn: updateBluePrintWeek,
    onSuccess: () => {
      invalidate("blueprint-active");
      invalidate("blueprint-week-active");
      callBack();
      toast.success("Blue Print details updated", {
        id: "update-blueprint-week",
      });
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-blueprint-week" }),
  });

  const onBluePrintWeekUpdate = useCallback(
    (values: UpdateBluePrintWeekSchemaType) => {
      toast.loading("Updating Blueprint Week...", {
        id: "update-blueprint-week",
      });
      bluePrintWeekUpdateMutate(values);
    },
    [bluePrintWeekUpdateMutate]
  );

  //Calculate Next Week BluePrint
  //TODO - change this to use mutate
  const onCalculateBlueprintTargets = async () => {
    createNewBlueprintWeek();
    invalidateMultiple([
      "blueprint-work-info",
      "blueprints",
      "blueprints-weekly",
      "blueprint-week-active",
      "blueprint-active",
    ]);
  };

  return {
    onAgentWorkInfoInsert,
    agentWorkInfoInserting,
    onAgentWorkInfoUpdate,
    agentWorkInfoUpdating,
    onBluePrintWeekUpdate,
    bluePrintWeekUpdating,
    onCalculateBlueprintTargets,
  };
};
