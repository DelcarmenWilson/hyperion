"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";

type Props = {
  adAccount: string | null;
  loading: boolean;
  onSubmit: (e: string) => void;
};
export const FacebookForm = ({ adAccount, loading, onSubmit }: Props) => {
  const [account, setAccount] = useState(adAccount || "");
  return (
    <div>
      <Heading title={"Ad Account"} description="Manage facebook ad account" />
      <div className="w-[50%]">
        <Input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="e.g. 1245685"
          disabled={loading}
          autoComplete="adAccount"
        />
        <div className="flex justify-end mt-2">
          <Button
            disabled={loading || adAccount == account}
            onClick={() => onSubmit(account)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
