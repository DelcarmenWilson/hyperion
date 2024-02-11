"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

const TestPage = () => {
  const onSendReminder = () => {
    axios.get("/api/appointments/reminder").then((data) => {
      console.log(data);
    });
  };
  return (
    <div>
      <Button onClick={onSendReminder}>Reminder</Button>
    </div>
  );
};

export default TestPage;
