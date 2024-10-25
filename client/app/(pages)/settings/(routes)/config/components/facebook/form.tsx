"use client";
import { useState } from "react";
import { useFacebookActions } from "../../hooks/use-config";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";

type Props = {
  adAccount: string | null | undefined;
};
export const FacebookForm = ({ adAccount }: Props) => {
  const { adAccountIsPending, onAdAccountSubmit } = useFacebookActions();
  const [account, setAccount] = useState(adAccount || "");
  return (
    <div>
      <Heading title={"Ad Account"} description="Manage facebook ad account" />
      <div className="w-[50%]">
        <Input
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="e.g. 1245685"
          disabled={adAccountIsPending}
          autoComplete="adAccount"
        />
        <div className="flex justify-end mt-2">
          <Button
            disabled={adAccountIsPending || adAccount == account}
            onClick={() => onAdAccountSubmit(account.replaceAll(" ", ""))}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
