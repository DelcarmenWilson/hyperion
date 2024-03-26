import { create } from "zustand";

type SidebarStore ={
  collapsed: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  collapsed: true,  
  onExpand:()=>set(()=>({ collapsed:false})),
  onCollapse:()=>set(()=>({ collapsed:true}))
}));