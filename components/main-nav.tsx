"use client";

import { Button } from "@/components/ui/button";
import { usePhoneModal } from "@/hooks/use-phone-modal";

export function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const usePm = usePhoneModal();

  return (
    <div>
      <Button onClick={usePm.onPhoneInOpen}>Open Modal</Button>
    </div>
  );
}
