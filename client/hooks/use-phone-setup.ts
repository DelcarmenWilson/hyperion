import { useEffect, useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { create } from "zustand";

import { PhoneNumber } from "@prisma/client";

import {
  phoneNumberUpdateByIdApp,
  phoneNumberUpdateByIdAssign,
} from "@/actions/phonenumber";

type usePhoneSetupStore = {
  //UNASSIGNEDFORM
  phoneNumber?: PhoneNumber;
  isUnassignedFormOpen: boolean;
  onUnassignedFormOpen: (p: PhoneNumber) => void;
  onUnassignedFormClose: () => void;
};

export const usePhoneSetup = create<usePhoneSetupStore>((set) => ({
  isUnassignedFormOpen: false,
  onUnassignedFormOpen: (p) =>
    set({ phoneNumber: p, isUnassignedFormOpen: true }),
  onUnassignedFormClose: () =>
    set({
      phoneNumber: undefined,
      isUnassignedFormOpen: false,
    }),
}));

export const usePhoneSetupActions = (
  onClose: () => void,
  phoneNumber?: PhoneNumber
) => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | undefined>(
    phoneNumber?.agentId || undefined
  );
  const [app, setApp] = useState<string | undefined>(phoneNumber?.app);
  const [registered, setRegistered] = useState<boolean | undefined>(
    phoneNumber?.registered
  );
  const [loading, setLoading] = useState(false);
  //SHARING
  const onAssignNumber = async () => {
    if (!userId || userId == phoneNumber?.agentId) return;
    setLoading(true);
    const assignedNumber = await phoneNumberUpdateByIdAssign(
      phoneNumber?.id!,
      userId
    );
    if (assignedNumber.success) {
      toast.success(assignedNumber.success);
      onClose();
      router.refresh();
    } else toast.error(assignedNumber.error);
    setLoading(false);
  };
  const onNumberUpdateApp = async () => {
    if (!app || app == phoneNumber?.app) return;
    setLoading(true);
    const response = await axios.post("/api/twilio/phonenumber/update", {
      sid: phoneNumber?.sid,
      app,
    });
    const data = response.data;
    console.log(data);

    if (data) {
      const updatedNumber = await phoneNumberUpdateByIdApp(
        phoneNumber?.id!,
        app
      );
      if (updatedNumber.success) {
        toast.success(updatedNumber.success);
        onClose();
        router.refresh();
      } else toast.error(updatedNumber.error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!phoneNumber) return;
    setUserId(phoneNumber.agentId || undefined);
    setApp(phoneNumber.app);
  }, [phoneNumber]);
  return {
    userId,
    setUserId,
    app,
    setApp,
    registered,
    setRegistered,

    loading,
    onAssignNumber,
    onNumberUpdateApp,
  };
};
