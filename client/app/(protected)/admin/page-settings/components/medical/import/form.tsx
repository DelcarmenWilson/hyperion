"use client";
import * as z from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DataTableImport } from "@/components/tables/data-table-import";
import { ImportMedicalConditionColumn, columns } from "./columns";

import { MedicalConditionSchema } from "@/schemas";
import { convertCondition } from "@/formulas/admin";
import { adminMedicalImport } from "@/actions/admin";

type ImportMedicalConditionFormValues = z.infer<typeof MedicalConditionSchema>;

export const ImportMedicalConditionForm = () => {
  const router = useRouter();
  const [conditions, setConditions] = useState<
    ImportMedicalConditionFormValues[]
  >([]);
  const [formattedConditions, setFormattedConditions] = useState<
    ImportMedicalConditionColumn[]
  >([]);
  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: ImportMedicalConditionFormValues[] =
          convertCondition(result);
        setConditions(mapped);
        const fls: ImportMedicalConditionColumn[] = mapped.map((condition) => ({
          name: condition.name,
          description: condition.description,
        }));
        setFormattedConditions(fls);
      },
    });
  };
  const onImport = () => {
    startTransition(() => {
      adminMedicalImport(conditions).then((data) => {
        if (data?.error) {
          toast.error(data.error);
        }
        if (data?.success) {
          onCancel();
          toast.success(data.success);
          router.refresh();
        }
      });
    });
  };

  const onCancel = () => {
    setConditions([]);
    setFormattedConditions([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">
          Import Medical Conditions
        </h3>
        <div className="flex justify-end items-center w-full">
          <div className="flex w-[300px] justify-end items-center gap-2">
            {conditions.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button disabled={isPending} onClick={onImport}>
                  Import
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollArea>
        <DataTableImport
          columns={columns}
          data={formattedConditions}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
