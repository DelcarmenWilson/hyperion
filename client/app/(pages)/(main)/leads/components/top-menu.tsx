"use client";

import { useState } from "react";
import { Download, Paperclip, Plus } from "lucide-react";
import Link from "next/link";
import { useLeadStore } from "@/hooks/lead/use-lead";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImportLeadsForm } from "./import/import-leads-form";
import { NewLeadForm } from "./new-lead-form";
import { ExportLeadForm } from "./export-lead-form";
import Hint from "@/components/custom/hint";

export const TopMenu = () => {
  const { onNewLeadFormOpen, onExportFormOpen, onImportFormOpen } =
    useLeadStore();
  return (
    <div className="flex justify-end gap-2 w-full">
      {/* <NewLeadForm /> */}
      <ExportLeadForm />
      <ImportLeadsForm />
      <Hint label="View all duplicated Leads" side="bottom">
        <Button size="sm" asChild>
          <Link href="/duplicate-leads">DUPLICATE LEADS</Link>
        </Button>
      </Hint>
      <Hint label="Import Leads" side="bottom">
        <Button
          className="gap-2"
          variant="outlineprimary"
          size="sm"
          onClick={onImportFormOpen}
        >
          <Paperclip size={16} />
          Upload Csv File
        </Button>
      </Hint>

      <Hint label="Export Leads" side="bottom">
        <Button
          className="gap-2"
          variant="outlineprimary"
          size="sm"
          onClick={onExportFormOpen}
        >
          <Download size={16} />
          EXPORT LEADS
        </Button>
      </Hint>

      <Hint label="Add new lead" side="bottom">
        <Button className="gap-2" size="sm" onClick={() => onNewLeadFormOpen()}>
          <Plus size={16} />
          CREATE LEAD
        </Button>
      </Hint>
    </div>
  );
};