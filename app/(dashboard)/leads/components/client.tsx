"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DownloadCloud, Paperclip, Plus } from "lucide-react";
import { NewLeadDrawer } from "./new-lead-drawer";
import { ImportLeadsForm } from "./import/import-leads-form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LeadClient = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <NewLeadDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="flex gap-2 mr-6">
        <Button variant="outlineprimary" size="sm">
          <DownloadCloud className="h-4 w-4 mr-2" />
          GENERATE CSV
        </Button>

        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outlineprimary" size="sm">
                    <Paperclip className="h-4 w-4 mr-2" />
                    UPLOAD CSV FILE
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import Leads</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="p-0 max-h-[96%] max-w-[98%] bg-transparent">
            <ImportLeadsForm />
          </DialogContent>
        </Dialog>

        <Button size="sm" onClick={() => setDrawerOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          CREATE LEAD
        </Button>
      </div>
    </>
  );
};
