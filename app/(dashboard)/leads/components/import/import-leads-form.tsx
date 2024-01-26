"use client";
import * as z from "zod";

import Papa from "papaparse";
import { useState, useTransition } from "react";
import { LeadSchema } from "@/schemas";

import { DataTable } from "@/components/data-table";
import { ImportLeadColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { leadsImport } from "@/data/actions/lead";
import { Gender, MaritalStatus } from "@prisma/client";
import { capitalize } from "@/formulas/text";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { reFormatPhoneNumber } from "@/formulas/phones";

type ImportLeadsFormValues = z.infer<typeof LeadSchema>;

export const ImportLeadsForm = () => {
  const [leads, setLeads] = useState<ImportLeadsFormValues[]>([]);
  const [formattedLeads, setFormmatedLeads] = useState<ImportLeadColumn[]>([]);

  const [hasData, setHasData] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFile = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        let mapped: any = [];
        result.data.map((d: any) => {
          const newobj: ImportLeadsFormValues = {
            id: "",
            firstName: capitalize(d["First Name"]),
            lastName: capitalize(d["Last Name"]),
            email: d["Email"].toLowerCase(),
            homePhone: reFormatPhoneNumber(d["Home"]),
            cellPhone: reFormatPhoneNumber(d["Other Phone 1"]),
            // dateOfBirth:
            //   d["Date Of Birth"].length > 2
            //     ? new Date(d["Date Of Birth"])
            //     : undefined,
            dateOfBirth: d["Date Of Birth"],
            address: capitalize(d["Street Address"]),
            city: capitalize(d["City"]),
            state: capitalize(d["State"]),
            gender: Gender.Male,
            maritalStatus: MaritalStatus.Single,
            zipCode: d["Zip"],
          };
          mapped.push(newobj);
        });
        setLeads(mapped);
        console.log(mapped);
        const fls: ImportLeadColumn[] = mapped.map(
          (lead: ImportLeadsFormValues) => ({
            id: "",
            fullName: `${lead.firstName} ${lead.lastName}`,
            email: lead.email,
            cellPhone: lead.cellPhone,
            dob: lead.dateOfBirth ? format(lead.dateOfBirth, "MM/dd/yy") : "",
            address: lead.address,
            city: lead.city,
            state: lead.state,
            zip: lead.zipCode,
          })
        );
        setFormmatedLeads(fls);
        setHasData(true);
      },
    });
  };
  const handleImport = () => {
    startTransition(() => {
      leadsImport(leads).then((data) => {
        if (data?.success) {
          toast.success(data.success);
        }
        if (data?.error) {
          toast.error(data.error);
        }
      });
    });
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Leads</h3>
        <div className="flex justify-end items-center w-full">
          {hasData && (
            <Button disabled={isPending} onClick={handleImport}>
              Import
            </Button>
          )}
        </div>
      </div>
      <ScrollArea>
        <DataTable
          columns={columns}
          data={formattedLeads}
          size="lg"
          noresults="Select a file"
          setFile={handleFile}
        />
      </ScrollArea>
    </div>
  );
};
