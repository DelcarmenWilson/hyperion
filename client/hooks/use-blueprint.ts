import { create } from "zustand";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

type useBluePrintStore = {
  //AGENTWORKINFO
  workInfo?: AgentWorkInfo;
  isWorkInfoFormOpen: boolean;
  onWorkInfoFormOpen: (w?: AgentWorkInfo) => void;
  onWorkInfoFormClose: () => void;

  bluePrintWeek?: BluePrintWeek;
  isBluePrintWeekFormOpen: boolean;
  onBluePrintWeekFormOpen: (b?: BluePrintWeek) => void;
  onBluePrintWeekFormClose: () => void;
};

export const useBluePrint = create<useBluePrintStore>((set) => ({
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

export const useBluePrintActions = (onClose?: () => void) => {
  const queryClient = useQueryClient();

  const { data: agentWorkInfo, isFetching: isFetchingAgentWorkInfo } =
    useQuery<AgentWorkInfo | null>({
      queryFn: () => agentWorkInfoGetByUserId(),
      queryKey: ["agentWorkInfo"],
    });

  const { data: bluePrints, isFetching: isFetchingBluePrints } = useQuery<
    BluePrint[]
  >({
    queryFn: () => bluePrintsGetAllByUserId(),
    queryKey: ["agentBluePrints"],
  });

  const {
    data: bluePrintWeekActive,
    isFetching: isFetchingBluePrintWeekActive,
  } = useQuery<BluePrintWeek | null>({
    queryFn: () => bluePrintWeekGetActive(),
    queryKey: ["agentBluePrintWeekActive"],
  });

  const {
    data: bluePrintYearActive,
    isFetching: isFetchingBluePrintYearActive,
  } = useQuery<BluePrint | null>({
    queryFn: () => bluePrintGetActive(),
    queryKey: ["agentBluePrintActive"],
  });

  const { data: bluePrintsWeekly, isFetching: isFetchingBluePrintsWeekly } =
    useQuery<BluePrintWeek[]>({
      queryFn: () => bluePrintWeeksGetAllByUserId(),
      queryKey: ["agentBluePrintsWeekly"],
    });

  const {
    data: bluePrintWeekReport,
    isFetching: isFetchingBluePrintWeeksReport,
  } = useQuery<BluePrintWeek[]>({
    queryFn: () => bluePrintWeeksReport(),
    queryKey: ["agentBluePrintWeeksReport"],
  });

  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] });
  };
  //Agent Work Info
  const onAgentWorkInfoInsert = async (values: AgentWorkInfoSchemaType) => {
    const insertedAgentWorkInfo = await agentWorkInfoInsert(values);
    if (insertedAgentWorkInfo.error) {
      toast.error(insertedAgentWorkInfo.error);
    } else {
      [
        "agentWorkInfo",
        "agentBluePrints",
        "agentBluePrintsWeekly",
        "agentBluePrintWeekActive",
        "agentBluePrintActive",
      ].forEach((key) => invalidate(key));
      if (onClose) onClose();
      toast.success("Agent details got updated");
    }
  };
  const onAgentWorkInfoUpdate = async (values: AgentWorkInfoSchemaType) => {
    const updatedAgentWorkInfo = await agentWorkInfoUpdateByUserId(values);
    if (updatedAgentWorkInfo.error) toast.error(updatedAgentWorkInfo.error);
    else {
      invalidate("agentFullTimeInfo");
      if (onClose) onClose();
      toast.success("Agent details got updated");
    }
  };
  //Blue Print Week
  const onBluePrintWeekUpdate = async (values: BluePrintWeekSchemaType) => {
    const updatedBluePrintWeek = await bluePrintWeekUpdateById(values);
    if (updatedBluePrintWeek.error) toast.error(updatedBluePrintWeek.error);
    else {
      invalidate("agentBluePrintWeekActive");
      if (onClose) onClose();
      toast.success("Blue Print details updated");
    }
  };
  //Calculate Next Week BluePrint
  const onCalculateBlueprintTargets = async () => {
    createWeeklyBlueprint();
    [
      "agentWorkInfo",
      "agentBluePrints",
      "agentBluePrintsWeekly",
      "agentBluePrintWeekActive",
      "agentBluePrintActive",
    ].forEach((key) => invalidate(key));
  };

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
    onAgentWorkInfoInsert,
    onAgentWorkInfoUpdate,
    onBluePrintWeekUpdate,
    onCalculateBlueprintTargets,
  };
};
