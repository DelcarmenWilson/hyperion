import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

export const PaymentCountry = ({
  data: { currency, country, countryCode },
}: NodeProps<{ currency: string; country: string; countryCode: string }>) => {
  return (
    <div className="flex items-center w-[155px] bg-[#e2e8f0]  border border-[#bbbdbf] rounded-[8px] gap-2 p-2">
      <div>
        <p className="text-2xl">{countryCode}</p>
      </div>
      <div className="flex-1">
        <p>{country}</p>
        <p>{currency}</p>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
