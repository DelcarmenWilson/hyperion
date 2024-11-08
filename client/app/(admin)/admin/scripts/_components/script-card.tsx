"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MoreVerticalIcon,
  PlayIcon,
  ShuffleIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";

import { Script } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TooltipWrapper from "@/components/tooltip-wrapper";
import DeleteScriptDialog from "./delete-script-dialog";

const ScriptCard = ({ script }: { script: Script }) => {
  return (
    <Card className="border border-separate shadow-sm rounded-lg  overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div className="flex w-10 h-10 rounded-full items-center justify-center">
            <PlayIcon className="w-5 h-5 stroke-primary" />
          </div>
          <div className="flex items-center">
            <h3 className="flex flex-col">
              <Link
                href={`/scripts/${script.id}`}
                className="flex items-center text-base font-bold text-muted-foreground hover:underline capitalize"
              >
                {script.name}
              </Link>
              <p className="text-xs text-muted-foreground italic capitalize">
                {script.description}
              </p>
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/scripts/${script.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} /> Edit
          </Link>
          <ScriptActions scriptId={script.id} scriptName={script.name} />
        </div>
      </CardContent>
    </Card>
  );
};
const ScriptActions = ({
  scriptId,
  scriptName,
}: {
  scriptId: string;
  scriptName: string;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteScriptDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        scriptId={scriptId}
        scriptName={scriptName}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <TooltipWrapper content="More actions">
              <div className="flex items-center justify-center w-full h-full">
                <MoreVerticalIcon size={18} />
              </div>
            </TooltipWrapper>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <TrashIcon size={16} /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
export default ScriptCard;
