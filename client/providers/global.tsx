"use client";
import { createContext, useContext, useEffect } from "react";
import { useCalendarStore } from "@/hooks/calendar/use-calendar-store";
import { useChatStore } from "@/hooks/use-chat";
import { usePhoneStore } from "@/hooks/use-phone";

type GlobalContextProviderProps = {
  children: React.ReactNode;
};

type GlobalContext = {};

export const GlobalContext = createContext<GlobalContext | null>(null);
//TODO - see if this can be removed by making the other context components a priority
export default function GlobalContextProvider({
  children,
}: GlobalContextProviderProps) {
  const { fetchData: fetchOnlineUsers } = useChatStore();
  const { fetchData: fetchCalendarData } = useCalendarStore();
  const { fetchData: fetchScriptData } = usePhoneStore();

  useEffect(() => {
    fetchOnlineUsers();
    fetchCalendarData();
    fetchScriptData();
  }, []);
  return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>;
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
