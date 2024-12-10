
import { create } from "zustand";

type State = {
  isLeadInfoOpen: boolean;
  onLeadInfoToggle: () => void;
};

export const useConversationStore = create<State>((set, get) => ({
  isLeadInfoOpen: false,
  onLeadInfoToggle: () => set({ isLeadInfoOpen: !get().isLeadInfoOpen }),
}));