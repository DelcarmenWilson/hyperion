"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";

import { adminConfirmUserEmail } from "@/actions/admin/user";
import { OtherUserSelect } from "@/components/user/select";

export const EmailConfirm = ({ user }: { user: string }) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState<string | undefined>(user);
  const [date, setDate] = useState(new Date().toLocaleString());

  const onSubmit = () => {
    if (!selecteUser) toast.error("Please slect a user");

    if (!date) toast.error("Please enter a date");
    setLoading(true);
    adminConfirmUserEmail(selecteUser as string, date).then((data) => {
      if (data.error) toast.error(data.error);
      else toast.success(data.success);
    });
    setLoading(true);
  };
  return (
    <div>
      <Heading title={`Email Confirm`} description="Confirm users email" />
      <div className="flex flex-col gap-2">
        <p className="text-sm">User</p>
        <div className="w-[200px]">
          <OtherUserSelect
            disabled={loading}
            setUserId={setSelecteUser}
            userId={selecteUser}
          />
        </div>

        <p className="text-sm">Date</p>
        <Input defaultValue={date} onChange={(e) => setDate(e.target.value)} />
        <div className="text-right">
          <Button onClick={onSubmit}>Submit</Button>
        </div>
      </div>
    </div>
  );
};
