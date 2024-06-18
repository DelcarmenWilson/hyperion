import { create } from "zustand";

type useImageViewerStore = {
  isOpen: boolean;
  imageUrl?:string | null;
  alt?:string
  onOpen: (imageUrl:string|null,alt:string) => void;
  onClose: () => void;
};

export const useImageViewer = create<useImageViewerStore>((set) => ({
  isOpen: false,
  onOpen: (e,f) => set({imageUrl:e,alt:f, isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
