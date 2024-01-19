"use client";

import { FullConversationType } from "@/types";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: FullConversationType;
}
export const ProfileDrawer = ({
  isOpen,
  onClose,
  data,
}: ProfileDrawerProps) => {
  return <div>ProfileDrawer</div>;
};
