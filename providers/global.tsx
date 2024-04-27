"use client";
import { createContext, useContext, useState } from "react";
import {
  LeadStatus,
  Script,
  User,
  UserLicense,
  UserTemplate,
} from "@prisma/client";
import { FullUserCarrier } from "@/types";

type GlobalContextProviderProps = {
  initUser: User;
  initStatus: LeadStatus[];
  intScript: Script;
  initLicenses: UserLicense[];
  initCarriers: FullUserCarrier[];
  initTemplates: UserTemplate[];
  children: React.ReactNode;
};

type GlobalContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  leadStatus: LeadStatus[] | null;
  setLeadStatus: React.Dispatch<React.SetStateAction<LeadStatus[] | null>>;
  script: Script | null;
  setScript: React.Dispatch<React.SetStateAction<Script | null>>;
  licenses: UserLicense[] | null;
  setLicenses: React.Dispatch<React.SetStateAction<UserLicense[] | null>>;
  carriers: FullUserCarrier[] | null;
  setCarriers: React.Dispatch<React.SetStateAction<FullUserCarrier[] | null>>;
  templates: UserTemplate[] | null;
  setTemplates: React.Dispatch<React.SetStateAction<UserTemplate[] | null>>;
};

export const GlobalContext = createContext<GlobalContext | null>(null);

export default function GlobalContextProvider({
  initUser,
  initStatus,
  intScript,
  initLicenses,
  initCarriers,
  initTemplates,
  children,
}: GlobalContextProviderProps) {
  const [user, setUser] = useState<User | null>(initUser);
  const [leadStatus, setLeadStatus] = useState<LeadStatus[] | null>(initStatus);
  const [script, setScript] = useState<Script | null>(intScript);
  const [licenses, setLicenses] = useState<UserLicense[] | null>(initLicenses);
  const [carriers, setCarriers] = useState<FullUserCarrier[] | null>(
    initCarriers
  );
  const [templates, setTemplates] = useState<UserTemplate[] | null>(
    initTemplates
  );

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        leadStatus,
        setLeadStatus,
        script,
        setScript,
        licenses,
        setLicenses,
        carriers,
        setCarriers,
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
