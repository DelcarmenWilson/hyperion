"use client";

import { Button } from "@/components/ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CopyButtonProps = {
  value: string;
  message?: string;
};
export const CopyButton = ({ value, message }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = () => {
    if (!value) return;
    setIsCopied(true);
    navigator.clipboard.writeText(value);
    if (message) {
      toast.success(`${message} copied to the clipboard`);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const Icon = isCopied ? CheckCheck : Copy;
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onCopy}
      disabled={!value || isCopied}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};
