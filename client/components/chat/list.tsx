"use client";
import React from "react";
import ChatCard from "./card";
import { useGlobalContext } from "@/providers/global";

export const ChatList = () => {
  const { users } = useGlobalContext();
  return (
    <div className="h-full overflow-y-auto pe-2">
      {users?.map((user) => (
        <ChatCard key={user.id} user={user} />
      ))}
    </div>
  );
};
