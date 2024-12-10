import { useCallback } from "react";
import axios from "axios";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useInvalidate } from "./use-invalidate";
import { toast } from "sonner";

import { PhoneNumber } from "@prisma/client";
import { FullPhoneNumber } from "@/types";
import { PhoneNumberSchemaType } from "@/schemas/phone-number";

import {
  getAssignedPhoneNumbers,
  getUnassignedPhoneNumbers,
  updatePhoneNumber,
} from "@/actions/user/phone-number";

//TODO - need to rename all the format all the function
export const usePhoneSetupData = () => {
  //PHONE NUMBERS
  const { data: phoneNumbers, isFetching: isFetchingPhoneNumbers } = useQuery<
    FullPhoneNumber[]
  >({
    queryFn: () => getAssignedPhoneNumbers(),
    queryKey: ["phone-numbers"],
  });

  const { data: unasignedNumbers, isFetching: isFetchingUnasignedNumbers } =
    useQuery<PhoneNumber[]>({
      queryFn: () => getUnassignedPhoneNumbers(),
      queryKey: ["unasignedNumbers"],
    });

  return {
    phoneNumbers,
    isFetchingPhoneNumbers,
    unasignedNumbers,
    isFetchingUnasignedNumbers,
  };
};

export const usePhoneSetupActions = (cb:()=>void) => {
  const {invalidate}=useInvalidate()

  
  //PHONE NUMBER
  const { mutate: updatePhoneNumberMutate, isPending: phoneNumberUpdating } =
    useMutation({
      mutationFn: updatePhoneNumber,
      onSuccess: async (results) => {
      
          const { changes, app, sid } = results;
          if (changes)
            await axios.post("/api/twilio/phonenumber/update", { sid, app });

          toast.success("Phone Number Updated!!", {
            id: "update-phone-number",
          });
      },
      onError: (error) => 
        toast.error(error.message, {
          id: "update-phone-number",
        }),
      
      onSettled: () => 
        invalidate("phone-numbers")
      ,
    });

  const onUpdatePhoneNumber = useCallback(
    (values: PhoneNumberSchemaType) => {
      toast.loading("Updating Phone Number Details...", {
        id: "update-phone-number",
      });
      updatePhoneNumberMutate(values);
    },
    [updatePhoneNumberMutate]
  );

  return {
    onUpdatePhoneNumber,
    phoneNumberUpdating,
  };
};
