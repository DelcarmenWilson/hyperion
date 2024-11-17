
import { Input } from "@/components/ui/input";
import { TouchPad } from "../addins/touch-pad";
import { useDialerStore } from "../hooks/use-dialer";
import { DrawerRight } from "@/components/custom/drawer/right";
import { useState } from "react";

export const DialpadDrawer = () => {
  const { isDialPadFormOpen, onDialPadFormToggle,} = useDialerStore();
    const [number,setNumber]   =useState("")
  const onNumberClick =(num:string)=>{
    setNumber(prev=>prev+=num)
  }
  return (

    <DrawerRight
      title="Dialpad"
      isOpen={isDialPadFormOpen}
      onClose={onDialPadFormToggle}
      scroll={false}
    >
      <div className="flex flex-col">
      <Input value={number} onChange={(e)=>setNumber(e.target.value)} />
      
      <div className="relative overflow-hidden">
      <TouchPad onNumberClick={onNumberClick}/>
      </div>
      </div>
    </DrawerRight>
  );
};
