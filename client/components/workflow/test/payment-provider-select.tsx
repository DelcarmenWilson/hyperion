import { Plus } from "lucide-react";
import { Node } from "reactflow";
import { toast } from "sonner";

import { useEditorStore } from "@/hooks/workflow/use-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PAYMENT_PROVIDERS } from "@/constants/react-flow/node-types";
import { nodeInsert } from "@/actions/workflow";

export const PaymentProviderSelect = ({
  workFlowId,
  setNodes,
}: {
  workFlowId: string;
  setNodes: React.Dispatch<
    React.SetStateAction<Node<{}, string | undefined>[]>
  >;
}) => {
  const { onDrawerOpen } = useEditorStore();
  // const { setNodes } = useReactFlow();
  const onProviderClick = async ({
    name,
    code,
  }: {
    code: string;
    name: string;
  }) => {
    const json = { name, code };
    // const newNode = await nodeInsert(workFlowId, json, "paymentProvider");
    // if (newNode.success) {
    //   setNodes((prevNodes) => [...prevNodes, newNode.success]);
    // } else {
    //   toast.error("There was an error creating the Node!");
    // }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2" variant="outline">
          Add Node <Plus size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Nodes</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onDrawerOpen("triggerlist")}>
            Trigger
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDrawerOpen("actionlist")}>
            Action
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Country
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Providers</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {PAYMENT_PROVIDERS.map((provider) => (
                  <DropdownMenuItem
                    key={provider.code}
                    onClick={() => onProviderClick(provider)}
                  >
                    {provider.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
