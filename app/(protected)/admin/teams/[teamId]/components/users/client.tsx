"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FullUserTeamReport } from "@/types";

import { columns } from "./columns";

import { DataTable } from "@/components/tables/data-table";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { Button } from "@/components/ui/button";
import { weekStartEnd } from "@/formulas/dates";

type UserClientProps = {
  users: FullUserTeamReport[];
  teamId: string;
};

export const UsersClient = ({ users, teamId }: UserClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initalUsers, setInitalUsers] = useState(users);
  const from = searchParams.get("from");
  const searchDates = {
    from: new Date(searchParams.get("from") as string),
    to: new Date(searchParams.get("to") as string),
  };
  const [dates, setDates] = useState(from ? searchDates : weekStartEnd());

  const onDateSelected = (e: any) => {
    setDates(e);
  };
  const onUpdate = () => {
    router.push(
      `/admin/teams/${teamId}?from=${dates.from.toLocaleDateString()}&to=${dates.to.toLocaleDateString()}`
    );
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row items-end gap-2 mb-2">
        <DateRangePicker
          setDate={onDateSelected}
          date={dates}
          className="flex"
        />
        <Button onClick={onUpdate}>Update</Button>
      </div>
      <DataTable columns={columns} data={initalUsers} />
    </>
  );
};
