import { create } from "zustand";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { data: agentWorkInfo, isFetching: isFetchingAgentWorkInfo } =
    useQuery<AgentWorkInfo | null>({
      queryFn: () => agentWorkInfoGetByUserId(),
      queryKey: ["agent-work-info"],
    });

  const { data: bluePrints, isFetching: isFetchingBluePrints } = useQuery<
    BluePrint[]
  >({
    queryFn: () => bluePrintsGetAllByUserId(),
    queryKey: ["agent-blueprints"],
  });

  const {
    data: bluePrintWeekActive,
    isFetching: isFetchingBluePrintWeekActive,
  } = useQuery<BluePrintWeek | null>({
    queryFn: () => bluePrintWeekGetActive(),
    queryKey: ["agent-blueprint-week-active"],
  });

  const {
    data: bluePrintYearActive,
    isFetching: isFetchingBluePrintYearActive,
  } = useQuery<BluePrint | null>({
    queryFn: () => bluePrintGetActive(),
    queryKey: ["agent-blueprint-active"],
  });

  const { data: bluePrintsWeekly, isFetching: isFetchingBluePrintsWeekly } =
    useQuery<BluePrintWeek[]>({
      queryFn: () => bluePrintWeeksGetAllByUserId(),
      queryKey: ["agent-blueprints-weekly"],
    });

  const {
    data: bluePrintWeekReport,
    isFetching: isFetchingBluePrintWeeksReport,
  } = useQuery<BluePrintWeek[]>({
    queryFn: () => bluePrintWeeksReport(),
    queryKey: ["agent-blueprint-weeks-report"],
  });

  return {
    agentWorkInfo,
    isFetchingAgentWorkInfo,
    bluePrints,
    isFetchingBluePrints,
    bluePrintWeekActive,
    isFetchingBluePrintWeekActive,
    bluePrintYearActive,
    isFetchingBluePrintYearActive,
    bluePrintsWeekly,
    isFetchingBluePrintsWeekly,
    bluePrintWeekReport,
    isFetchingBluePrintWeeksReport,
  };
};

export const useBluePrintActions = () => {
  const { onBluePrintWeekFormClose,onWorkInfoFormClose } = useBluePrintStore();
  const queryClient = useQueryClient();

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  //AGENT WORK INFO INSERT
  const {
    mutate: agentWorkInfoInsertMutate,
    isPending: agentWorkInfoInserting,
  } = useMutation({
    mutationFn: agentWorkInfoInsert,
    onSuccess: (results) => {
      if (results.success) {
        toast.success("Agent details have been created", {
          id: "insert-agent-work-info",
        });
        onWorkInfoFormClose();
        [
          "agent-work-info",
          "agent-blueprints",
          "agent-blueprints-weekly",
          "agent-blueprint-week-active",
          "agent-blue-print-active",
        ].forEach((key) => invalidate(key));
      } else {
        toast.error(results.error, { id: "insert-agent-work-info" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onAgentWorkInfoInsert = useCallback(
    (values: AgentWorkInfoSchemaType) => {
      toast.loading("Creating Work Info...", { id: "insert-agent-work-info" });
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
        invalidate("agent-full-time-info");
        onWorkInfoFormClose();
        toast.success("Agent details have been updated", {
          id: "update-agent-work-info",
        });
      } else {
        toast.error(results.error, { id: "update-agent-work-info" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
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
        invalidate("agent-blueprint-week-active");
         onBluePrintWeekFormClose();
        toast.success("Blue Print details updated", {
          id: "update-blueprint-week",
        });
      } else {
        toast.error(results.error, { id: "update-blueprint-week" });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
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
    [
      "agent-work-info",
      "agent-blueprints",
      "agent-blueprints-weekly",
      "agent-blueprint-week-active",
      "agent-blueprint-active",
    ].forEach((key) => invalidate(key));
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
