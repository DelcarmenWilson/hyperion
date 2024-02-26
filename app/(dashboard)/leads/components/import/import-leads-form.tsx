"use client";

import * as z from "zod";
import Papa from "papaparse";
import { useState, useTransition } from "react";

import { DataTableImport } from "@/components/tables/data-table-import";
import { ImportLeadColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { leadsImport } from "@/actions/lead";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertLead } from "@/formulas/lead";
import { importVendors } from "@/constants/lead";
import { LeadSchema } from "@/schemas";

type ImportLeadsFormValues = z.infer<typeof LeadSchema>;

export const ImportLeadsForm = () => {
  const [leads, setLeads] = useState<ImportLeadsFormValues[]>([]);
  const [formattedLeads, setFormmatedLeads] = useState<ImportLeadColumn[]>([]);
  const [vendor, setVendor] = useState(importVendors[0].value);

  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: ImportLeadsFormValues[] = convertLead(result, vendor);
        setLeads(mapped);
        const fls: ImportLeadColumn[] = mapped.map((lead) => ({
          id: "",
          fullName: `${lead.firstName} ${lead.lastName}`,
          email: lead.email,
          cellPhone: lead.cellPhone,
          // dob: lead.dateOfBirth ? format(lead.dateOfBirth, "MM/dd/yy") : "",
          dob: lead.dateOfBirth || "",
          address: lead.address,
          city: lead.city,
          state: lead.state,
          zip: lead.zipCode,
        }));
        setFormmatedLeads(fls);
      },
    });
  };
  const onImport = () => {
    startTransition(() => {
      leadsImport(leads).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };

  const onCancel = () => {
    setLeads([]);
    setFormmatedLeads([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Leads</h3>
        <div className="flex justify-between items-center w-full">
          <div className="flex w-[300px] items-center gap-2">
            <span>Vendor</span>
            <Select
              name="ddlVendor"
              defaultValue={vendor}
              onValueChange={(e) => setVendor(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                {importVendors.map((vendor) => (
                  <SelectItem key={vendor.name} value={vendor.value}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {leads.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" disabled={isPending} onClick={onCancel}>
                Cancel
              </Button>
              <Button disabled={isPending} onClick={onImport}>
                Import
              </Button>
            </div>
          )}
        </div>
      </div>
      <ScrollArea>
        <DataTableImport
          columns={columns}
          data={formattedLeads}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
