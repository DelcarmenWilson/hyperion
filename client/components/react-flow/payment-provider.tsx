import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { NodeProps, Position, useReactFlow } from "reactflow";
import { Button } from "@/components/ui/button";
import { nodeDeleteById } from "@/actions/workflow";
import { toast } from "sonner";
import { CustomHandle } from "./custom-handle";
import { PAYMENT_PROVIDER_IMAGE_MAP } from "@/constants/react-flow/node-types";

export const PaymentProvider = ({
  data: { name, code },
  id,
}: NodeProps<{ name: string; code: string }>) => {
  const { setNodes } = useReactFlow();
  const onDeleteNode = async () => {
    const deletedNode = await nodeDeleteById(id);
    if (deletedNode.success)
      setNodes((prevNodes) => prevNodes.filter((e) => e.id != id));
    else toast.error(deletedNode.error);
  };
  return (
    <div className="flex items-center w-[140px] bg-white  border border-[##5e5eff] rounded-[24px] gap-2 p-2 pl-3">
      <div className="h-3 w-3">
        <Image
          width={100}
          height={100}
          className="h-full w-full"
          src={PAYMENT_PROVIDER_IMAGE_MAP[code]}
          alt={name}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm">{name}</p>
      </div>
      <Button
        variant="outlinedestructive"
        size="xs"
        aria-label="Delete Payment Provider"
        onClick={onDeleteNode}
      >
        <X size={10} />
      </Button>

      <CustomHandle type="target" position={Position.Left} />
    </div>
  );
};
