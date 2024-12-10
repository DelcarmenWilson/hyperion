import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { useDialerStore } from "@/stores/dialer-store";
import { usePhoneStore } from "@/stores/phone-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TouchPad } from "../addins/touch-pad";

const DialpadDialog = () => {
  const { call } = usePhoneStore();
  const { isDialPadFormOpen, onDialPadFormToggle } = useDialerStore();
  const [number, setNumber] = useState("");

  const onNumberClick = (num: string) => {
    setNumber((prev) => (prev += num));
    if (call) call.sendDigits(num);
  };

  const onReset = () => setNumber("");
  if (call) return null;
  return (
    <div
      className={cn(
        "absolute flex flex-col gap-2 -bottom-full bg-background right-2 z-50 border p-2 rounded-sm transition-bottom duration-500 ease-in-out",
        isDialPadFormOpen && "bottom-0"
      )}
    >
      <div className="flex justify-between items-center">
        <p className="font-bold tetx-sm">Dialpad</p>
        <Button size="xs" variant="outline" onClick={onDialPadFormToggle}>
          <ChevronDown size={15} />
        </Button>
      </div>
      <div className="relative">
        <Input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          disabled={!call}
        />
        <X
          className={cn(
            "h-4 w-4 absolute right-2 top-0 translate-y-1/2 cursor-pointer transition-opacity ease-in-out",
            number.length == 0 ? "opacity-0" : "opacity-100"
          )}
          onClick={onReset}
        />
      </div>
      <div className="relative overflow-hidden">
        <TouchPad onNumberClick={onNumberClick} disabled={!call} />
      </div>
    </div>
  );
};
export default DialpadDialog;
