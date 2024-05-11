"use client";

import { useState } from "react";
import { Download, Paperclip, Plus } from "lucide-react";

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
import { ExportLeadForm } from "./export-lead-form";

export const TopMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  return (
    <div className="flex justify-end gap-2 w-full">
      <DrawerRight
        title="New Lead"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <NewLeadForm onClose={() => setIsOpen(false)} />
      </DrawerRight>
      <DrawerRight
        title="Export Leads"
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      >
        <ExportLeadForm onClose={() => setIsExportOpen(false)} />
      </DrawerRight>
      <Dialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button className="gap-2" variant="outlineprimary" size="sm">
                <Paperclip size={16} />
                Upload Csv File
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Import Leads</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent className="p-0 max-h-[96%] max-w-[98%] bg-transparent">
          <ImportLeadsForm />
        </DialogContent>
      </Dialog>

      <Button
        className="gap-2"
        variant="outlineprimary"
        size="sm"
        onClick={() => setIsExportOpen(true)}
      >
        <Download size={16} />
        EXPORT LEADS
      </Button>

      <Button className="gap-2" size="sm" onClick={() => setIsOpen(true)}>
        <Plus size={16} />
        CREATE LEAD
      </Button>
    </div>
  );
};
