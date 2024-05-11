import { create } from "zustand";

type SidebarStore ={
  collapsed: boolean;
  onToggleCollapse:(e:boolean)=>void
  // onExpand: () => void;
  // onCollapse: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  collapsed: true,  
  onToggleCollapse:(e)=>set(()=>({ collapsed:e})),
  // onExpand:()=>set(()=>({ collapsed:false})),
  // onCollapse:()=>set(()=>({ collapsed:true}))
}));