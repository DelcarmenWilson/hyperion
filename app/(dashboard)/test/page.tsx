"use client";

import { creatCall } from "@/actions/test";
import { Button } from "@/components/ui/button";

const TestPage = () => {
  const startCall = () => {
    creatCall();
  };
  return (
    <div>
      <Button onClick={startCall}>Call</Button>
    </div>
  );
};

export default TestPage;
