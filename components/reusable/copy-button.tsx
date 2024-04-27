"use client";

import { Button } from "@/components/ui/button";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type CopyButtonProps = {
  value: string;
  message?: string;
  text?: string;
  size?: "default" | "sm" | "xs" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outlinedestructive"
    | "outline"
    | "outlineprimary"
    | "secondary"
    | "ghost"
    | "link";
};
export const CopyButton = ({
  value,
  message,
  text,
  size = "sm",
  variant = "ghost",
}: CopyButtonProps) => {
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
      className="gap-2"
      size={size}
      variant={variant}
      onClick={onCopy}
      disabled={!value || isCopied}
    >
      <Icon size={16} />
      {text}
    </Button>
  );
};
