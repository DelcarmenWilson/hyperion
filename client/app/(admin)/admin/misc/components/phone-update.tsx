"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

import { adminUpdateLeadNumbers } from "@/actions/admin/lead";
import { adminUpdateUserNumber } from "@/actions/admin/user";
import { OtherUserSelect } from "@/components/user/select";

export const PhoneUpdate = ({ user }: { user: string }) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState<string | undefined>(user);

  const onLeadNumbersUpdate = () => {
    if (!selecteUser) toast.error("Please slect a user");

    setLoading(true);
    adminUpdateLeadNumbers(selecteUser as string).then((data) => {
      if (data.error) toast.error(data.error);
      else toast.success(data.success);
    });
    setLoading(false);
  };
  const onUserNumberUpdate = () => {
    if (!selecteUser) toast.error("Please slect a user");

    setLoading(true);
    adminUpdateUserNumber(selecteUser as string).then((data) => {
      if (data.error) toast.error(data.error);
      else toast.success(data.success);
    });
    setLoading(false);
  };

  return (
    <div>
      <Heading
        title={`Phone Update`}
        description="Change user specific number"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm">User</p>
        <div className="w-[200px]">
          <OtherUserSelect
            disabled={loading}
            setUserId={setSelecteUser}
            userId={selecteUser}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button disabled={loading} onClick={onLeadNumbersUpdate}>
            Lead Number Update
          </Button>
          <Button disabled={loading} onClick={onUserNumberUpdate}>
            User Number Update
          </Button>
        </div>
      </div>
    </div>
  );
};
