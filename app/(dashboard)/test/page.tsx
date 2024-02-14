"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

const TestPage = () => {
  const [recordId, setRecordId] = useState("");
  const [results, setResults] = useState("");
  const onGetRecoding = () => {
    axios.post("/api/test", { recordId: recordId }).then((response) => {
      if (response) {
        setResults(response.data);
      }
    });
  };

  // const onInputChange=(e)=>{

  // }

  return (
    <div className="flex flex-col gap-2">
      <Input
        defaultValue={recordId}
        onChange={(e) => setRecordId(e.target.value)}
        placeholder="Recording Id"
      />
      <Button disabled={recordId.length < 10} onClick={onGetRecoding}>
        Reminder
      </Button>
      <div>{JSON.stringify(results)}</div>
    </div>
  );
};

export default TestPage;
