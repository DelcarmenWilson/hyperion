import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FullPipeline, PipelineLead } from "@/types";
import { pipelineAndLeadsGetAll } from "@/actions/user/pipeline";

type State = {
  type: "edit" | "insert";
  pipelines?: FullPipeline[];
  leads?: PipelineLead[];
  filterLeads?: PipelineLead[];
  timeZone: string;
  pipelineId?: string;
  selectedPipeline?: FullPipeline;
  pipeIndex: number;
  isFormOpen: boolean;
  isAlertOpen: boolean;
  loaded: boolean;
};

type Actions = {
  updateLeadStatus: (e: string, s: string) => void;
  updateFilteredLeads: (e: string) => void;
  setPipelines: (p: FullPipeline[]) => void;
  setSelectedPipeline: (p: FullPipeline, t: string) => void;
  onSetIndex: (e: number) => void;
  deletePipeline: (e: string) => void;
  addPipeline: (e: FullPipeline) => void;
  onFormOpen: (t: "edit" | "insert", e?: string) => void;
  onFormClose: () => void;
  onAlertOpen: (e: string) => void;
  onAlertClose: () => void;
  initialSetUp: (p: FullPipeline[], l: PipelineLead[]) => void;
};

export const usePipelineStore = create<State & Actions>()(
  immer((set, get) => ({
    pipeIndex: 0,
    timeZone: "",
    loaded: false,
    type: "insert",
    setPipelines(p) {
      set({ pipelines: p });
    },
    setSelectedPipeline(p, t) {
      set((state) => {
        (state.selectedPipeline = p),
          (state.timeZone = t == "%" ? "" : t),
          (state.pipeIndex = p.index),
          (state.filterLeads = state.leads?.filter(
            (l) => l.statusId == p.statusId
          ));
      });
    },

    onSetIndex: (e) => set({ pipeIndex: e }),
    deletePipeline: (e) =>
      set((state) => {
        state.pipelines = state.pipelines?.filter((p) => p.id != e);
      }),
    addPipeline: (e) =>
      set((state) => {
        state.pipelines?.push(e);
      }),

    updateLeadStatus: (leadId, newStatusId) =>
      set((state) => {
        state.leads = state.leads?.map((lead) =>
          lead.id == leadId ? { ...lead, statusId: newStatusId } : lead
        );
        console.log("inside the leadStatus function");
        state.updateFilteredLeads(leadId);
      }),

    updateFilteredLeads(leadId) {
      set((state) => {
        console.log("inside the filterLeads function", leadId);
        state.filterLeads = state.filterLeads?.filter((e) => e.id != leadId);
        console.log(state.filterLeads, state.pipeIndex);
        state.pipeIndex = 0;
        console.log(state.filterLeads, state.pipeIndex);
        // state.pipeIndex =
        //   state.pipeIndex == state.pipelines!.length - 1
        //     ? state.pipeIndex - 1
        //     : state.pipeIndex + 1;
      });
    },
    isFormOpen: false,
    onFormOpen: (t, e) => set({ pipelineId: e, type: t, isFormOpen: true }),
    onFormClose: () => set({ isFormOpen: false, pipelineId: undefined }),
    isAlertOpen: false,
    onAlertOpen: (e) => set({ pipelineId: e, isAlertOpen: true }),
    onAlertClose: () => set({ pipelineId: undefined, isAlertOpen: false }),
    fetchData: async () => {
      if (!get().loaded) return;
      const pipeLinesAndLeads = await pipelineAndLeadsGetAll();
      if (!pipeLinesAndLeads) return;
      set({
        pipelines: pipeLinesAndLeads.pipelines,
        leads: pipeLinesAndLeads.leads,
        loaded: true,
      });
    },

    initialSetUp: (p, l) =>
      set({
        pipelines: p,
        leads: l,
        loaded: true,
      }),
  }))
);
