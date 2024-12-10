"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/custom/heading";
import { OtherUserSelect } from "@/components/user/select";

import { adminChangeLeadDefaultNumber } from "@/actions/admin/lead";

export const NumberChange = ({ user }: { user: string }) => {
  const [loading, setLoading] = useState(false);
  const [selecteUser, setSelecteUser] = useState<string | undefined>(user);
  const [oldPhone, setOldPhone] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const onSubmit = () => {
    if (!selecteUser || !oldPhone || !newPhone) toast.error("Invalid Data");
    setLoading(true);
    adminChangeLeadDefaultNumber(
      selecteUser as string,
      oldPhone,
      newPhone
    ).then((data) => {
      toast.success(data.success);
    });
    setLoading(false);
  };
  return (
    <div>
      <Heading
        title={`Change Number`}
        description="Change user specific number"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm">User</p>
        <div className="w-[200px]">
          <OtherUserSelect
            disabled={loading}
            userId={selecteUser}
            setUserId={setSelecteUser}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm">Old Phone Number</p>
            <Input
              defaultValue={oldPhone}
              onChange={(e) => setOldPhone(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <p className="text-sm">New Phone Number</p>

            <Input
              defaultValue={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="text-right">
          <Button disabled={loading} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
