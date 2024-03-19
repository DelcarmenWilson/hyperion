"use client";

import { useState } from "react";
import { Paperclip, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DrawerRight } from "@/components/custom/drawer-right";
import { ImportLeadsForm } from "./import/import-leads-form";
import { NewLeadForm } from "./new-lead-form";

export const TopMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* <Button variant="outlineprimary" size="sm">
              <DownloadCloud className="h-4 w-4 mr-2" />
              GENERATE CSV
            </Button> */}

      <DrawerRight
        title="New Lead"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <NewLeadForm onClose={() => setIsOpen(false)} />
      </DrawerRight>

      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="outlineprimary" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Upload Csv File
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import Leads</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="p-0 max-h-[96%] max-w-[98%] bg-transparent">
          <ImportLeadsForm />
        </DialogContent>
      </Dialog>

      <Button size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        CREATE LEAD
      </Button>
    </>
  );
};
