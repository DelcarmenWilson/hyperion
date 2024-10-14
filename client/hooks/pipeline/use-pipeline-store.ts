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
        //   ?.filter((l) =>
        //     (t == "%" ? l : l.zone == p.statusId) && l.statusId == p.statusId
        // ));
        //TODO 0 need to filter the timezone aswell
        //  state.filterLeads=state.leads?.filter(l=>l.statusId==p.statusId && t!="%"?l.zone==t:l)
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

    updateLeadStatus: (e, s) =>
      set((state) => {
        state.leads = state.leads?.map((l) => {
          if (l.id == e) return { ...l, status: s };
          return l;
        });
      }),
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
