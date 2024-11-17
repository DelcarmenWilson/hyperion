import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDialerStore } from "../hooks/use-dialer";

import { Input } from "@/components/ui/input";
import { TouchPad } from "../addins/touch-pad";
import { DrawerRight } from "@/components/custom/drawer/right";

export const DialpadDrawer = () => {
  const { isDialPadFormOpen, onDialPadFormToggle } = useDialerStore();
  const [number, setNumber] = useState("");
  const onNumberClick = (num: string) => {
    setNumber((prev) => (prev += num));
  };
  const onReset = () => {
    setNumber("");
  };
  return (
    <DrawerRight
      title="Dialpad"
      isOpen={isDialPadFormOpen}
      onClose={onDialPadFormToggle}
      scroll={false}
    >
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Input value={number} onChange={(e) => setNumber(e.target.value)} />
          <X
            className={cn(
              "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
              number.length == 0 ? "opacity-0" : "opacity-100"
            )}
            onClick={onReset}
          />
        </div>
        <div className="relative overflow-hidden">
          <TouchPad onNumberClick={onNumberClick} />
        </div>
      </div>
    </DrawerRight>
  );
};
