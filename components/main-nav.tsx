"use client";
import { Button } from "@/components/ui/button";
import { usePhone } from "@/hooks/use-phone";

export const MainNav = () => {
  const usePm = usePhone();

  return <Button onClick={usePm.onPhoneInOpen}>Open Modal</Button>;
};
