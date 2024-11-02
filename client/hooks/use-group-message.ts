import { create } from "zustand";

type State = {
  message?: string;
  userName?: string;
  isOpen:boolean
};
type Actions = {
  onOpen: (m: string, u: string) => void;
  onClose: () => void;
};

export const useGroupMessageStore = create<State & Actions>((set) => ({
  isOpen:false,
  onOpen: (m,u) => set({ isOpen:true, message: m,userName:u}),
  onClose: () => set({isOpen:false, message: undefined,userName:undefined }),
}));

