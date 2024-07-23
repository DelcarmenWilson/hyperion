import { create } from "zustand";

type SidebarStore ={
  isOpen: boolean;
  onToggleCollapse:()=>void
  // onExpand: () => void;
  // onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,  
  onToggleCollapse:()=>set((state)=>({ isOpen:!state.isOpen})),
  // onExpand:()=>set(()=>({ collapsed:false})),
  // onCollapse:()=>set(()=>({ collapsed:true}))
}));