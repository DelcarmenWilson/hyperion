import { create } from "zustand";
//TODO-REMOVE this is not used at all
type State = {
  isOpen: boolean;
  imageUrl?:string | null;
  alt?:string
};
type Actions = {
  onOpen: (imageUrl:string|null,alt:string) => void;
  onClose: () => void;
};

export const useImageViewerStore = create<State & Actions>((set) => ({
  isOpen: false,
  onOpen: (e,f) => set({imageUrl:e,alt:f, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
