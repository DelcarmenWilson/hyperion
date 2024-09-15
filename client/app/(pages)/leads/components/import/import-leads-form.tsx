"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";
import { useCurrentRole } from "@/hooks/user-current-role";

import { DataTableImport } from "@/components/tables/data-table-import";
import { ImportLeadColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { convertLead } from "@/formulas/lead";
import { allLeadTypes, importVendors } from "@/constants/lead";
import { LeadSchemaType } from "@/schemas/lead";

import { leadsImport } from "@/actions/lead";
import { useQuery } from "@tanstack/react-query";
import { FullPipeline } from "@/types";
import { User } from "@prisma/client";
import { usersGetAllByRole } from "@/actions/user";
import { pipelineGetAll } from "@/actions/user/pipeline";

export const ImportLeadsForm = () => {
  const role = useCurrentRole();
  const router = useRouter();
  const [leads, setLeads] = useState<LeadSchemaType[]>([]);
  const [formattedLeads, setFormmatedLeads] = useState<ImportLeadColumn[]>([]);
  const [vendor, setVendor] = useState(importVendors[0].value);
  const [leadType, setLeadType] = useState("General");
  const [status, setStatus] = useState<string>();
  const [assistant, setAssistant] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const disabled = leads.length > 0;

  const { data: pipelines, isFetching: pipelinesIsFetching } = useQuery<
    FullPipeline[]
  >({
    queryKey: ["userPipelines"],
    queryFn: () => pipelineGetAll(),
  });
  const { data: assistants, isFetching: assistantsIsFetching } = useQuery<
    User[]
  >({
    queryKey: ["userAsisstants"],
    queryFn: () => usersGetAllByRole("ASSISTANT"),
  });

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        try {
          const mapped: LeadSchemaType[] = convertLead(
            result,
            vendor,
            leadType,
            status || "New",
            assistant || undefined
          );
          setLeads(mapped);
          const fls: ImportLeadColumn[] = mapped.map((lead) => ({
            id: "",
            ...lead,
            fullName: `${lead.firstName} ${lead.lastName}`,
            dob: lead.dateOfBirth || "",
            zip: lead.zipCode,
          }));
          setFormmatedLeads(fls);
        } catch (error) {
          console.log(error);
          toast.error("The file does not match the vendor chosen!!");
        }
      },
    });
  };

  const onImport = () => {
    startTransition(() => {
      leadsImport(leads).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
          router.refresh();
        } else toast.error(data.error);
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
        <div className="grid grid-cols-1 lg:grid-cols-4 items-center gap-2 w-full">
          <div className="flex items-center gap-2">
            <span>Vendor</span>
            <Select
              name="ddlVendor"
              disabled={disabled}
              defaultValue={vendor}
              onValueChange={setVendor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Vendor" />
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
          <div className="flex items-center gap-2">
            <span>Type</span>
            <Select
              name="ddlLeadType"
              disabled={disabled}
              defaultValue={leadType}
              onValueChange={setLeadType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Lead Type" />
              </SelectTrigger>
              <SelectContent>
                {allLeadTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span>Pipeline</span>
            <Select
              name="ddlStatus"
              disabled={disabled || pipelinesIsFetching}
              defaultValue={status}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines?.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.status.status}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {role == "ADMIN" && (
            <div className="flex items-center gap-2">
              <span>Assitant</span>
              <Select
                name="ddlAssistant"
                disabled={disabled || assistantsIsFetching}
                defaultValue={assistant}
                onValueChange={setAssistant}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an Assistant" />
                </SelectTrigger>
                <SelectContent>
                  {assistants?.map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.id}>
                      {assistant.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      {disabled && (
        <div className="flex justify-end items-center gap-2">
          <Button variant="outline" disabled={isPending} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={isPending} onClick={onImport}>
            Import
          </Button>
        </div>
      )}
    </div>
  );
};
