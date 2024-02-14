"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";

import { Presets } from "@prisma/client";
import { DataTableImport } from "@/components/tables/data-table-import";
import { columns } from "./columns";
import { toast } from "sonner";
import { convertPresets } from "@/formulas/inital-data";
import { initialPresets } from "@/actions/initial-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export const PresetsBox = () => {
  const [presets, setPresets] = useState<Presets[]>([]);
  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: Presets[] = convertPresets(result);
        setPresets(mapped);
      },
    });
  };

  const onImport = () => {
    startTransition(() => {
      initialPresets(presets).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
        }
      });
    });
  };

  const onCancel = () => {
    setPresets([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">Import Presets</h3>
        <div className="flex justify-end items-center w-full">
          {presets.length > 0 && (
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
          data={presets}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
