import { Plus } from "lucide-react";
import { useEditorStore } from "@/hooks/workflow/use-editor";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NodeSelect = ({ nodesCount }: { nodesCount: number }) => {
  const { onDrawerOpen } = useEditorStore();

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
          <DropdownMenuItem
            disabled={nodesCount > 0}
            onClick={() => onDrawerOpen("triggerlist")}
          >
            Trigger
            <DropdownMenuShortcut>⇧⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={nodesCount == 0}
            onClick={() => onDrawerOpen("actionlist")}
          >
            Action
            <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
