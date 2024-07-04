"use client";
import { createContext, useContext, useState } from "react";
import {
  Carrier,
  LeadStatus,
  Script,
  User,
  UserLicense,
  UserTemplate,
} from "@prisma/client";
import { FullUserCarrier } from "@/types";
import { OnlineUser } from "@/types/user";

type GlobalContextProviderProps = {
  initUser: User;
  initUsers: OnlineUser[];
  initStatus: LeadStatus[];
  intScript: Script;
  initLicenses: UserLicense[];
  initCarriers: FullUserCarrier[];
  initAvailableCarriers: Carrier[];
  initTemplates: UserTemplate[];
  children: React.ReactNode;
};

type GlobalContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: OnlineUser[] | null;
  setUsers: React.Dispatch<React.SetStateAction<OnlineUser[] | null>>;
  leadStatus: LeadStatus[] | null;
  setLeadStatus: React.Dispatch<React.SetStateAction<LeadStatus[] | null>>;
  script: Script | null;
  setScript: React.Dispatch<React.SetStateAction<Script | null>>;
  licenses: UserLicense[] | null;
  setLicenses: React.Dispatch<React.SetStateAction<UserLicense[] | null>>;
  carriers: FullUserCarrier[] | null;
  setCarriers: React.Dispatch<React.SetStateAction<FullUserCarrier[] | null>>;
  availableCarriers: Carrier[] | null;
  setAvailableCarriers: React.Dispatch<React.SetStateAction<Carrier[] | null>>;
  templates: UserTemplate[] | null;
  setTemplates: React.Dispatch<React.SetStateAction<UserTemplate[] | null>>;
};

export const GlobalContext = createContext<GlobalContext | null>(null);

export default function GlobalContextProvider({
  initUser,
  initUsers,
  initStatus,
  intScript,
  initLicenses,
  initCarriers,
  initAvailableCarriers,
  initTemplates,
  children,
}: GlobalContextProviderProps) {
  const [user, setUser] = useState<User | null>(initUser);
  const [users, setUsers] = useState<OnlineUser[] | null>(initUsers);
  const [leadStatus, setLeadStatus] = useState<LeadStatus[] | null>(initStatus);
  const [script, setScript] = useState<Script | null>(intScript);
  const [licenses, setLicenses] = useState<UserLicense[] | null>(initLicenses);
  const [carriers, setCarriers] = useState<FullUserCarrier[] | null>(
    initCarriers
  );
  const [availableCarriers, setAvailableCarriers] = useState<Carrier[] | null>(
    initAvailableCarriers
  );
  const [templates, setTemplates] = useState<UserTemplate[] | null>(
    initTemplates
  );

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        users,
        setUsers,
        leadStatus,
        setLeadStatus,
        script,
        setScript,
        licenses,
        setLicenses,
        carriers,
        setCarriers,
        availableCarriers,
        setAvailableCarriers,
        templates,
        setTemplates,
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
