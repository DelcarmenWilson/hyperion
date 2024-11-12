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

import { Badge } from "@/components/ui/badge";
import { ScriptStatus } from "@/types/script";
import DeleteDialog from "@/components/custom/delete-dialog";
import { useScriptActions } from "@/hooks/admin/use-script";

const ScriptCard = ({ script }: { script: Script }) => {
  const isDraft = script.status == ScriptStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm rounded-lg  overflow-hidden hover:shadow-sm dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div className="flex w-10 h-10 rounded-full items-center justify-center">
            <PlayIcon className="w-5 h-5 stroke-primary" />
          </div>
          <div className="flex items-start gap-2">
            <h3 className="flex flex-col w-[200px]">
              <Link
                href={`/admin/scripts/${script.id}`}
                className="flex items-center text-base font-bold text-muted-foreground hover:underline capitalize"
              >
                {script.name}
              </Link>
              <p className="text-xs text-muted-foreground italic capitalize">
                {script.description}
              </p>
            </h3>
            <Badge variant="outline" className="uppercase rounded-md text-xs">
              {script.type}
            </Badge>
            <Badge
              variant={isDraft ? "secondary" : "default"}
              className="uppercase rounded-md text-xs"
            >
              {script.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={`/admin/scripts/${script.id}`}
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
  const { onDeleteScript, deletingScript } = useScriptActions();
  return (
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
        <DropdownMenuItem className="cursor-pointer gap-2" asChild>
          <DeleteDialog
            title="script"
            cfText={scriptName}
            onConfirm={() => onDeleteScript(scriptId)}
            loading={deletingScript}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ScriptCard;
