import React from "react";
import { NodeProps, Position } from "reactflow";
import { CustomHandle } from "./custom-handle";

export const PaymentInit = ({
  data: { amount },
}: NodeProps<{ amount: number }>) => {
  return (
    <div className="border border-[#aa1fff]">
      <div className="bg-[#410566] p-1 text-white">
        <p className="text-sm">Payment Initialized</p>
      </div>
      <div className="p-2">
        <p className="text-2xl text-blue-600">${amount}</p>
      </div>
      <CustomHandle type="source" position={Position.Right} />
    </div>
  );
};
