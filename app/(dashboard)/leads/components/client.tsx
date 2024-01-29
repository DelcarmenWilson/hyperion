"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DownloadCloud, Paperclip, Plus, Users } from "lucide-react";
import { NewLeadDrawer } from "./new-lead-drawer";
import { ImportLeadsForm } from "./import/import-leads-form";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DashBoardTable } from "../../dashboard/components/dashboard-table";
import { LeadColumn, columns } from "./columns";

interface LeadClientProps {
  leads: LeadColumn[];
}
export const LeadClient = ({ leads }: LeadClientProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      {/* <NewLeadDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
      </div> */}

      <NewLeadDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Card className="flex flex-col flex-1 relative overflow-hidden w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-4 rounded-br-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className=" text-sm text-muted-foreground">
              View Leads
            </CardTitle>
          </div>
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
        </div>

        <CardContent className="flex flex-1 flex-col items-center space-y-0 pb-2 overflow-hidden">
          <ScrollArea className="w-full flex-1 pr-2">
            <DashBoardTable
              columns={columns}
              data={leads}
              searchKey="lastName"
            />
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};
