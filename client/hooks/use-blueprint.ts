import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { AgentWorkInfo, BluePrint, BluePrintWeek } from "@prisma/client";
import {
  AgentWorkInfoSchemaType,
  BluePrintWeekSchemaType,
} from "@/schemas/blueprint";

import {
  agentWorkInfoGetByUserId,
  agentWorkInfoInsert,
  agentWorkInfoUpdateByUserId,
} from "@/actions/blueprint/agent-work-info";
import {
  bluePrintWeekGetActive,
  bluePrintWeeksGetAllByUserId,
  bluePrintWeeksReport,
  bluePrintWeekUpdateById,
  createWeeklyBlueprint,
} from "@/actions/blueprint/blueprint-week";
import {
  bluePrintGetActive,
  bluePrintsGetAllByUserId,
} from "@/actions/blueprint/blueprint";
import { useInvalidate } from "./use-invalidate";

type State = {
  //AGENTWORKINFO
  workInfo?: AgentWorkInfo;
  isWorkInfoFormOpen: boolean;
  //BLUEPRINT FORM
  bluePrintWeek?: BluePrintWeek;
  isBluePrintWeekFormOpen: boolean;
};

type Actions = {
  //AGENTWORKINFO
  onWorkInfoFormOpen: (w?: AgentWorkInfo) => void;
  onWorkInfoFormClose: () => void;
  //BLUEPRINT FORM
  onBluePrintWeekFormOpen: (b?: BluePrintWeek) => void;
  onBluePrintWeekFormClose: () => void;
};

export const useBluePrintStore = create<State & Actions>((set) => ({
  isWorkInfoFormOpen: false,
  onWorkInfoFormOpen: (w) => set({ workInfo: w, isWorkInfoFormOpen: true }),
  onWorkInfoFormClose: () =>
    set({
      workInfo: undefined,
      isWorkInfoFormOpen: false,
    }),
  isBluePrintWeekFormOpen: false,
  onBluePrintWeekFormOpen: (b) =>
    set({ bluePrintWeek: b, isBluePrintWeekFormOpen: true }),
  onBluePrintWeekFormClose: () =>
    set({
      bluePrintWeek: undefined,
      isBluePrintWeekFormOpen: false,
    }),
}));

export const useBluePrintData = () => {
  const onAgentWorkInfoGet = () => {
    const {
      data: agentWorkInfo,
      isFetching: agentWorkInfoIsFetching,
      isLoading: agentWorkInfoIsLoading,
    } = useQuery<AgentWorkInfo | null>({
      queryFn: () => agentWorkInfoGetByUserId(),
      queryKey: ["blueprint-work-info"],
    });
    return { agentWorkInfo, agentWorkInfoIsFetching, agentWorkInfoIsLoading };
  };

  const onBluePrintsGet = () => {
    const {
      data: bluePrints,
      isFetching: bluePrintsIsFetching,
      isLoading: bluePrintsIsLoading,
    } = useQuery<BluePrint[]>({
      queryFn: () => bluePrintsGetAllByUserId(),
      queryKey: ["blueprints"],
    });
    return {
      bluePrints,
      bluePrintsIsFetching,
      bluePrintsIsLoading,
    };
  };

  const onBluePrintWeekActiveGet = () => {
    const {
      data: bluePrintWeekActive,
      isFetching: bluePrintWeekActiveIsFetching,
      isLoading: bluePrintWeekActiveIsLoading,
    } = useQuery<BluePrintWeek | null>({
      queryFn: () => bluePrintWeekGetActive(),
      queryKey: ["blueprint-week-active"],
    });
    return {
      bluePrintWeekActive,
      bluePrintWeekActiveIsFetching,
      bluePrintWeekActiveIsLoading,
    };
  };

  const onBluePrintYearActiveGet = () => {
    const {
      data: bluePrintYearActive,
      isFetching: bluePrintYearActiveIsFetching,
      isLoading: bluePrintYearActiveIsLoading,
    } = useQuery<BluePrint | null>({
      queryFn: () => bluePrintGetActive(),
      queryKey: ["blueprint-active"],
    });
    return {
      bluePrintYearActive,
      bluePrintYearActiveIsFetching,
      bluePrintYearActiveIsLoading,
    };
  };

  const onBluePrintsWeeklyGet = () => {
    const {
      data: bluePrintsWeekly,
      isFetching: bluePrintsWeeklyIsFetching,
      isLoading: bluePrintsWeeklyIsLoading,
    } = useQuery<BluePrintWeek[]>({
      queryFn: () => bluePrintWeeksGetAllByUserId(),
      queryKey: ["blueprints-weekly"],
    });
    return {
      bluePrintsWeekly,
      bluePrintsWeeklyIsFetching,
      bluePrintsWeeklyIsLoading,
    };
  };

  const onBluePrintWeekReportGet = () => {
    const {
      data: bluePrintWeekReport,
      isFetching: bluePrintWeeksReportIsFetching,
      isLoading: bluePrintWeeksReportIsLoading,
    } = useQuery<BluePrintWeek[]>({
      queryFn: () => bluePrintWeeksReport(),
      queryKey: ["blueprint-weeks-report"],
    });
    return {
      bluePrintWeekReport,
      bluePrintWeeksReportIsFetching,
      bluePrintWeeksReportIsLoading,
    };
  };
  return {
    onAgentWorkInfoGet,
    onBluePrintsGet,
    onBluePrintWeekActiveGet,
    onBluePrintYearActiveGet,
    onBluePrintsWeeklyGet,
    onBluePrintWeekReportGet,
  };
};

export const useBluePrintActions = () => {
  const { onBluePrintWeekFormClose, onWorkInfoFormClose } = useBluePrintStore();

  const { invalidate,invalidateMultiple } = useInvalidate();
  //AGENT WORK INFO INSERT
  const {
    mutate: agentWorkInfoInsertMutate,
    isPending: agentWorkInfoInserting,
  } = useMutation({
    mutationFn: agentWorkInfoInsert,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Agent details have been created", {
          id: "insert-blueprint-work-info",
        });
        onWorkInfoFormClose();
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
    (values: AgentWorkInfoSchemaType) => {
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
    mutationFn: agentWorkInfoUpdateByUserId,
    onSuccess: (results) => {
      if (results.success) {
        invalidate("blueprint-work-info");
        onWorkInfoFormClose();
        toast.success("Agent details have been updated", {
          id: "update-agent-work-info",
        });
      } else toast.error(results.error, { id: "update-blueprint-work-info" });
    },
    onError: (error) =>
      toast.error(error.message, { id: "update-agent-work-info" }),
  });

  const onAgentWorkInfoUpdate = useCallback(
    (values: AgentWorkInfoSchemaType) => {
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
    mutationFn: bluePrintWeekUpdateById,
    onSuccess: (results) => {
      if (results.success) {
        invalidate("blueprint-week-active");
        onBluePrintWeekFormClose();
        toast.success("Blue Print details updated", {
          id: "update-blueprint-week",
        });
      } else {
        toast.error(results.error, { id: "update-blueprint-week" });
      }
    },
    onError: (error) => 
      toast.error(error.message, { id: "update-blueprint-week" })    
  });

  const onBluePrintWeekUpdate = useCallback(
    (values: BluePrintWeekSchemaType) => {
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
    createWeeklyBlueprint();
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
