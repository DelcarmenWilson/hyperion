"use client";
import { PhoneMissedIcon } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";

import { CardLayout } from "@/components/custom/card/layout";
import { columns } from "./columns";
import { PhoneNumber } from "@prisma/client";

type UnassignedNumbersClientProps = {
  phoneNumbers: PhoneNumber[];
};

export const UnassignedNumbersClient = ({
  phoneNumbers,
}: UnassignedNumbersClientProps) => {
  if (!phoneNumbers.length) return null;
  return (
    <CardLayout title="Unassigned Numbers" icon={PhoneMissedIcon}>
      <DataTable data={phoneNumbers} columns={columns} headers />
    </CardLayout>
  );
};
