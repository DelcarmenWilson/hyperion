"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { FullUserTeamReport } from "@/types";
import { DateRangePicker } from "@/components/custom/date-range-picker";
import { weekStartEnd } from "@/formulas/dates";
import axios from "axios";

type UserClientProps = {
  users: FullUserTeamReport[];
  teamId: string;
};

export const UsersClient = ({ users, teamId }: UserClientProps) => {
  const [initalUsers, setInitalUsers] = useState(users);
  const [dates, setDates] = useState(weekStartEnd());

  const onDateSelected = (e: any) => {
    setDates(e);
  };
  // useEffect(()=>{
  // axios.post("/admin/user-team-report",{teamId:teamId})
  // },[])
  return (
    <>
      <div>
        <p className="text-muted-foreground">Date Range</p>
        <DateRangePicker
          setDate={onDateSelected}
          date={dates}
          className="flex"
        />
      </div>
      <DataTable columns={columns} data={initalUsers} searchKey="userName" />;
    </>
  );
};
