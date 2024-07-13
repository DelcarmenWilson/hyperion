"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Papa from "papaparse";
import { toast } from "sonner";

import { DataTableImport } from "@/components/tables/data-table-import";
import { importColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CarrierConditionSchemaType } from "@/schemas/admin";
import { convertCarrierCondition } from "@/formulas/admin";
import { Carrier, MedicalCondition } from "@prisma/client";
import { adminCarrierConditionsImport } from "@/actions/admin/carrier-condition";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";

export const ImportCarrierConditionsForm = ({
  carrier,
}: {
  carrier: Carrier;
}) => {
  const router = useRouter();
  const [carrierConditions, setCarrierConditions] = useState<
    CarrierConditionSchemaType[]
  >([]);

  const conditionsQuery = useQuery<MedicalCondition[]>({
    queryKey: ["adminConditions"],
    queryFn: adminMedicalConditionsGetAll,
  });

  const [isPending, startTransition] = useTransition();

  const onFileUploaded = (e: any) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result: any) {
        const mapped: CarrierConditionSchemaType[] = convertCarrierCondition(
          carrier.id,
          conditionsQuery.data,
          result
        );
        setCarrierConditions(mapped);
      },
    });
  };
  const onImport = () => {
    startTransition(() => {
      adminCarrierConditionsImport(carrierConditions).then((data) => {
        if (data?.success) {
          onCancel();
          toast.success(data.success);
          router.refresh();
        }
      });
    });
  };

  const onCancel = () => {
    setCarrierConditions([]);
  };
  return (
    <div className="h-[500px] flex flex-col gap-2 p-3 bg-background">
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-2xl font-semibold py-2">
          Import Conditions for{" "}
          <span className="text-primary font-bold">{carrier.name}</span>
        </h3>
        <div className="flex justify-between items-center w-full">
          <div className="flex w-[300px] items-center gap-2"></div>

          {carrierConditions.length > 0 && (
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
          columns={importColumns}
          data={carrierConditions}
          size="lg"
          noresults="Select a file"
          setFile={onFileUploaded}
        />
      </ScrollArea>
    </div>
  );
};
