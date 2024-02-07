"use client";

import { Button } from "./ui/button";
import { usePhoneModal } from "@/hooks/use-phone-modal";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const usePm = usePhoneModal();
  return (
    <div>
      <Button onClick={usePm.onPhoneOpen}>Open Modal</Button>
    </div>
  );
}
