"use client";
import { Download, Paperclip, Plus } from "lucide-react";
import Link from "next/link";
import { useLeadStore } from "@/stores/lead-store";

import { Button } from "@/components/ui/button";
import { ImportLeadsForm } from "./import/import-leads-form";
import { ExportLeadForm } from "./export-lead-form";
import Hint from "@/components/custom/hint";

export const TopMenu = () => {
  const { onNewLeadFormOpen, onExportFormOpen, onImportFormOpen } =
    useLeadStore();
  return (
    <div className="flex justify-end gap-2 w-full">
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
        <Button
          className="gap-2"
          size="sm"
          onClick={() => onNewLeadFormOpen(false)}
        >
          <Plus size={16} />
          CREATE LEAD
        </Button>
      </Hint>
    </div>
  );
};
