import { useCallback } from "react";
import { create } from "zustand";
import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PhoneNumber } from "@prisma/client";
import { FullPhoneNumber } from "@/types";
import { PhoneNumberSchemaType } from "@/schemas/phone-number";

import {
  phoneNumbersGetAssigned,
  phoneNumbersGetUnassigned,
  phoneNumberUpdateById,
} from "@/actions/user/phone-number";


type State = {
  phoneNumber?: PhoneNumber;
  isPhoneDetailsOpen: boolean;
};

type Actions = {
  onPhoneDetailsOpen: (p: PhoneNumber) => void;
  onPhoneDetailsClose: () => void;
};

export const usePhoneSetupStore = create<State & Actions>((set) => ({
  isPhoneDetailsOpen: false,
  onPhoneDetailsOpen: (p) => set({ phoneNumber: p, isPhoneDetailsOpen: true }),
  onPhoneDetailsClose: () =>
    set({
      phoneNumber: undefined,
      isPhoneDetailsOpen: false,
    }),
}));

export const usePhoneSetupData = () => {
  //PHONE NUMBERS
  const { data: phoneNumbers, isFetching: isFetchingPhoneNumbers } = useQuery<
    FullPhoneNumber[]
  >({
    queryFn: () => phoneNumbersGetAssigned(),
    queryKey: ["phoneNumbers"],
  });

  const { data: unasignedNumbers, isFetching: isFetchingUnasignedNumbers } =
    useQuery<PhoneNumber[]>({
      queryFn: () => phoneNumbersGetUnassigned(),
      queryKey: ["unasignedNumbers"],
    });

  return {
    phoneNumbers,
    isFetchingPhoneNumbers,
    unasignedNumbers,
    isFetchingUnasignedNumbers,
  };
};

export const usePhoneSetupActions = () => {
  const { phoneNumber, onPhoneDetailsClose } = usePhoneSetupStore();

  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["phoneNumbers"] });
  };

  //PHONE NUMBER
  const { mutate: phoneNumberMutate, isPending: phoneNumberIsPending } =
    useMutation({
      mutationFn: phoneNumberUpdateById,
      onSuccess: async (results) => {
        if (results.success) {
          const { app, sid } = results.success;
          if (app != phoneNumber?.app)
            await axios.post("/api/twilio/phonenumber/update", { sid, app });

          toast.success("Phone Number Updated!!", {
            id: "update-phone-number",
          });
          onPhoneDetailsClose();
        } else toast.error(results.error);
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        invalidate();
      },
    });

  const onPhoneNumberUpdate = useCallback(
    (values: PhoneNumberSchemaType) => {
      toast.loading("Updating Phone Number Details...", {
        id: "update-phone-number",
      });
      phoneNumberMutate(values);
    },
    [phoneNumberMutate]
  );

  return {
    onPhoneNumberUpdate,
    phoneNumberIsPending,
  };
};
