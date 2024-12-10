"use client";
import { useState } from "react";
import axios from "axios";
import { usePhoneStore } from "@/stores/phone-store";

import { Button } from "@/components/ui/button";
import { AgentSummaryColumn } from "./columns";
import Loader from "@/components/reusable/loader";

type CellActionProps = {
  agent: AgentSummaryColumn;
};
export const CellAction = ({ agent }: CellActionProps) => {
  const { onPhoneOutOpen } = usePhoneStore();
  const [loading, setLoading] = useState(false);
  const onJoinCall = () => {
    setLoading(true);
    axios
      .post("/api/leads/details/by-call", { callSid: agent.currentCall })
      .then((response) => {
        const data = response.data;
        if (data) {
          onPhoneOutOpen(data);
        }
      });
    setLoading(false);
  };
  if (!agent.coaching) {
    return null;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {agent.currentCall && <Button onClick={onJoinCall}>Join Call</Button>}
        </div>
      )}
    </>
  );
};
