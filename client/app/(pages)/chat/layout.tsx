import { CardLayout } from "@/components/custom/layout/card";
import React from "react";
import { ChatsClient } from "./components/chats/client";

type Props = {
  children: React.ReactNode;
};

const ChatsLayout = ({ children }: Props) => {
  return (
    <CardLayout>
      <ChatsClient />
      {children}
    </CardLayout>
  );
};

export default ChatsLayout;
