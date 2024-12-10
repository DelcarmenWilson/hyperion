
import { create } from "zustand";

type State = {
  isFormViewOpen: boolean;
  isAudienceViewOpen: boolean;
  isCreativeViewOpen: boolean;
};
type Actions = {
    setFormViewOpen: () => void;
    setAudienceViewOpen: () => void;
    setCreativeViewOpen: () => void;
  };

export const useCampaignStore = create<State&Actions>((set, get) => ({
  isFormViewOpen: false,
  setFormViewOpen: () =>
    set({
      isFormViewOpen: get().isFormViewOpen == false ? true : false,
      isAudienceViewOpen: false,
      isCreativeViewOpen: false,
    }),

  isAudienceViewOpen: false,
  setAudienceViewOpen: () =>
    set({
      isAudienceViewOpen: get().isAudienceViewOpen == false ? true : false,
      isCreativeViewOpen: false,
      isFormViewOpen: false,
    }),

  isCreativeViewOpen: false,
  setCreativeViewOpen: () =>
    set({
      isCreativeViewOpen: get().isCreativeViewOpen == false ? true : false,
      isAudienceViewOpen: false,
      isFormViewOpen: false,
    }),
}));