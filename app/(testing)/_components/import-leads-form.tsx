"use client";
import * as z from "zod";
import { Input } from "@/components/ui/input";

import Papa from "papaparse";
import { useState, useTransition } from "react";
import { LeadSchema } from "@/schemas";

import { DataTable } from "@/components/data-table";
import { leadColumns } from "@/columns/columns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { leadsImport } from "@/actions/lead";

export const ImportLeadsForm = () => {
  
  const user = useCurrentUser();
  const [leads, setLeads] = useState<z.infer<typeof LeadSchema>[]>([]);
  const [hasData, setHasData] = useState(false)  
  const [isPending, startTransition] = useTransition();

  const handleFile = (event: any) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const formatPhoneNumber = (str:string) => {
          let cleaned = ('' + str).replace(/\D/g, '');
          let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
          
          if (match) {
            let intlCode = (match[1] ? '+1 ' : '')
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
          }
          
          return "";
        }
        let mapped: any=[];
        result.data.map((d: any) => {
          const newobj:z.infer<typeof LeadSchema> = {
            id:"",
            firstName: d["First Name"],	
            lastName: d["Last Name"],	
            email: d["Email"],	
            homePhone: formatPhoneNumber(d["Home"])||undefined,	
            cellPhone: formatPhoneNumber(d["Other Phone 1"]),	
            address: d["Street Address"]||undefined,	
            dateOfBirth:new Date(d["Date Of Birth"]) || undefined,
            city: d["City"]||undefined,	
            state: d["State"],	
            zipCode: d["Zip"],	
            county: d["County"]||undefined,	
            updatedBy:user?.id

          };
          mapped.push(newobj);
        });
        setLeads(mapped);
        setHasData(true);
      },
    });
  };
  const handleImport = () => {
    startTransition(()=>{
    leadsImport(leads).then((data)=>{
      if(data?.success){
        toast.success(data.success)
      }
      // if(data?.error){
      //   toast.error(data.error)
      // }
    });
  })
  };
  return (
    <div className="bg-transparent h-[500px] flex flex-col gap-2 p-3 bg-white">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Leads</h3>
        <div className="flex justify-end items-center w-full">
          {hasData&&(
          <Button disabled={isPending} onClick={handleImport}>Import</Button>
          )}
        </div>
      </div>
      <br />
      <div className="flex-1 min-w-fit  w-full overflow-y-auto text-xs">
        <DataTable columns={leadColumns} data={leads} size="lg" noresults="Select a file" setFile={handleFile}/>
      </div>
    </div>
  );
};
