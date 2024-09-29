"use client";
import { createContext, useContext, useState } from "react";
import { OnlineUser } from "@/types/user";
import { useCalendarData } from "@/hooks/calendar/use-calendar";

type GlobalContextProviderProps = {
  initUsers: OnlineUser[];

  children: React.ReactNode;
};

type GlobalContext = {
  users: OnlineUser[] | null;
  setUsers: React.Dispatch<React.SetStateAction<OnlineUser[] | null>>;
};

export const GlobalContext = createContext<GlobalContext | null>(null);

export default function GlobalContextProvider({
  initUsers,
  children,
}: GlobalContextProviderProps) {
  const [users, setUsers] = useState<OnlineUser[] | null>(initUsers);
  useCalendarData();

  return (
    <GlobalContext.Provider
      value={{
        users,
        setUsers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used withing GlobalContextProvider"
    );
  }
  return context;
}
