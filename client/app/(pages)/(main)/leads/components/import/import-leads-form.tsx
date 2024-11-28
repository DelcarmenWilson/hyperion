"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";
import { useCurrentRole } from "@/hooks/user/use-current";
import { useUserData } from "@/hooks/user/use-user";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { usePipelineData } from "@/hooks/pipeline/use-pipeline";

import { getEnumValues } from "@/lib/helper/enum-converter";
import { LeadVendor } from "@/types/lead";
import { LeadSchemaType } from "@/schemas/lead";

import { DataTableImport } from "@/components/tables/data-table-import";
import { ImportLeadColumn, columns } from "./columns";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/global/custom-dialog";

import { LeadTypeSelect } from "@/components/lead/select/type-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { convertLead } from "@/formulas/lead";
import { leadsImport } from "@/actions/lead";
import { Loader2 } from "lucide-react";

export const ImportLeadsForm = () => {
  const role = useCurrentRole();
  const router = useRouter();
  const { isImportFormOpen, onImportFormClose } = useLeadStore();
  const { onSiteUserGet } = useUserData();
  const { pipelines, isFetchingPipelines } = usePipelineData();
  const [leads, setLeads] = useState<LeadSchemaType[]>([]);
  const [formattedLeads, setFormmatedLeads] = useState<ImportLeadColumn[]>([]);
  const leadVendors = getEnumValues(LeadVendor).slice(1);
  const [vendor, setVendor] = useState(leadVendors[0].value);
  const [leadType, setLeadType] = useState("General");
  const [status, setStatus] = useState<string>();
  const [assistant, setAssistant] = useState<string>();
  const [loading, startTransition] = useTransition();
  const { siteUsers, siteUsersFetching } = onSiteUserGet("ASSISTANT");
  const disabled = leads.length > 0;

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
            dob: lead.dateOfBirth ? new Date(lead.dateOfBirth) : null,
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
    onImportFormClose();
  };
  return (
    <CustomDialog
      open={isImportFormOpen}
      onClose={onImportFormClose}
      title="Import Leads"
      description="Import Leads Form"
      maxWidth={true}
      maxHeight={true}
      scroll={false}
    >
      <div className="bg-secondary grid grid-cols-1 lg:grid-cols-4 items-center gap-2 w-full mb-2 p-2">
        <div className="flex items-center gap-2">
          <span>Vendor</span>
          <Select
            name="ddlVendor"
            disabled={disabled}
            defaultValue={vendor}
            onValueChange={setVendor}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select a Vendor" />
            </SelectTrigger>
            <SelectContent>
              {leadVendors.map((vendor) => (
                <SelectItem key={vendor.value} value={vendor.value}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span>Type</span>
          <LeadTypeSelect
            id="type"
            disabled={disabled}
            type={leadType}
            onChange={setLeadType}
          />
        </div>

        <div className="flex items-center gap-2">
          <span>Pipeline</span>
          <Select
            name="ddlStatus"
            disabled={disabled || isFetchingPipelines}
            defaultValue={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select a Pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines?.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.statusId}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {role == "ADMIN" && (
          <div className="flex items-center gap-2">
            <span>Assistant</span>
            <Select
              name="ddlAssistant"
              disabled={disabled || siteUsersFetching}
              defaultValue={assistant}
              onValueChange={setAssistant}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select an Assistant" />
              </SelectTrigger>
              <SelectContent>
                {siteUsers?.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="gap-2"
          disabled={loading || !disabled}
          onClick={onImport}
        >
          <span className="sr-only">Import Button</span>
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Importing
            </>
          ) : (
            <span>Import</span>
          )}
        </Button>
      </div>
    </CustomDialog>
  );
};
