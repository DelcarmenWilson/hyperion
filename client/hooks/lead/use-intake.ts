import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";

import { LeadBeneficiary } from "@prisma/client";
import { FullLeadPolicy } from "@/types";

import { useQuery } from "@tanstack/react-query";
import {
  IntakeBankInfoSchemaType,
  IntakeDoctorInfoSchemaType,
  IntakeGeneralSchemaType,
  IntakeMedicalInfoSchemaType,
  IntakeOtherInfoSchemaType,
  IntakePersonalSchemaType,
  IntakePersonalMainSchemaType,
  IntakeEmploymentSchemaType,
  IntakeMiscSchemaType,
} from "@/schemas/lead";
import {
  leadGetByIdIntakeBankInfo,
  leadGetByIdIntakeDoctorInfo,
  leadGetByIdIntakeMedicalInfo,
  leadGetByIdIntakeOtherInfo,
  leadGetByIdIntakePersonalInfo,
  leadGetByIdIntakePolicyInfo,
  leadInsertIntakeBankInfo,
  leadInsertIntakeDoctorInfo,
  leadUpdateByIdIntakeBankInfo,
  leadUpdateByIdIntakeDoctorInfo,
  leadUpdateByIdIntakeEmployment,
  leadUpdateByIdIntakeGeneral,
  leadUpdateByIdIntakeMedicalInfo,
  leadUpdateByIdIntakeMisc,
  leadUpdateByIdIntakeOtherInfo,
  leadUpdateByIdIntakePersonal,
} from "@/actions/lead/intake";
import { leadBeneficiariesGetAllById } from "@/actions/lead/beneficiary";

export const useLeadIntakeData = () => {
  const { leadId } = useLeadStore();
  const { data: personal, isFetching: personalIsFectching } =
    useQuery<IntakePersonalMainSchemaType | null>({
      queryKey: [`lead-intake-personal-${leadId}`],
      queryFn: () => leadGetByIdIntakePersonalInfo(leadId as string),
    });

  const { data: beneficiaries, isFetching: beneficiariesIsFectching } =
    useQuery<LeadBeneficiary[]>({
      queryKey: [`lead-intake-beneficiaries-${leadId}`],
      queryFn: () => leadBeneficiariesGetAllById(leadId as string),
    });

  const { data: doctor, isFetching: doctorIsFectching } =
    useQuery<IntakeDoctorInfoSchemaType | null>({
      queryKey: [`lead-intake-doctor-${leadId}`],
      queryFn: () => leadGetByIdIntakeDoctorInfo(leadId as string),
    });

  const { data: bank, isFetching: bankIsFectching } =
    useQuery<IntakeBankInfoSchemaType | null>({
      queryKey: [`lead-intake-bank-${leadId}`],
      queryFn: () => leadGetByIdIntakeBankInfo(leadId!),
    });

  const { data: other, isFetching: otherIsFectching } =
    useQuery<IntakeOtherInfoSchemaType | null>({
      queryKey: [`lead-intake-other-${leadId}`],
      queryFn: () => leadGetByIdIntakeOtherInfo(leadId as string),
    });

  const { data: policy, isFetching: policyIsFectching } =
    useQuery<FullLeadPolicy | null>({
      queryKey: [`lead-intake-policy-${leadId}`],
      queryFn: () => leadGetByIdIntakePolicyInfo(leadId as string),
    });

  const { data: medical, isFetching: medicalIsFectching } =
    useQuery<IntakeMedicalInfoSchemaType | null>({
      queryKey: [`lead-intake-medical-${leadId}`],
      queryFn: () => leadGetByIdIntakeMedicalInfo(leadId as string),
    });

  return {
    personal,
    personalIsFectching,
    beneficiaries,
    beneficiariesIsFectching,
    doctor,
    doctorIsFectching,
    bank,
    bankIsFectching,
    other,
    otherIsFectching,
    policy,
    policyIsFectching,
    medical,
    medicalIsFectching,
  };
};

export const useLeadIntakeActions = (info?: boolean) => {
  const { leadId, onIntakeDialogClose } = useLeadStore();
  const queryClient = useQueryClient();
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({
      queryKey: [`${key}-${leadId}`],
    });
  };
  //DOCTOR
  const { mutate: doctorMutate, isPending: doctorIsPending } = useMutation({
    mutationFn: info
      ? leadUpdateByIdIntakeDoctorInfo
      : leadInsertIntakeDoctorInfo,
    onSuccess: (result) => {
      toast.success(result.success, { id: "insert-update-doctor" });
      invalidate("lead-intake-doctor");
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDoctorSubmit = useCallback(
    (values: IntakeDoctorInfoSchemaType) => {
      const toastString = info
        ? "Updating Doctor Information..."
        : "Creating Doctor Information...";
      toast.loading(toastString, { id: "insert-update-doctor" });
      doctorMutate(values);
    },
    [doctorMutate, info]
  );
  //BANK
  const { mutate: bankMutate, isPending: bankIsPending } = useMutation({
    mutationFn: info ? leadUpdateByIdIntakeBankInfo : leadInsertIntakeBankInfo,
    onSuccess: (result) => {
      toast.success(result.success, { id: "insert-update-bank" });
      invalidate("lead-intake-bank");
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onBankSubmit = useCallback(
    (values: IntakeBankInfoSchemaType) => {
      const toastString = info
        ? "Updating Bank Information..."
        : "Creating Bank Information...";
      toast.loading(toastString, { id: "insert-update-bank" });
      bankMutate(values);
    },
    [bankMutate, info]
  );
  //OTHER
  const { mutate: otherMutate, isPending: otherIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeOtherInfo,
    onSuccess: (result) => {
      toast.success(result.success, { id: "update-other" });
      invalidate("lead-intake-other");
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onOtherSubmit = useCallback(
    (values: IntakeOtherInfoSchemaType) => {
      const toastString = "Updating Other Information...";
      toast.loading(toastString, { id: "update-other" });
      otherMutate(values);
    },
    [otherMutate]
  );

  const { mutate: medicalMutate, isPending: medicalIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeMedicalInfo,
    onSuccess: (result) => {
      toast.success(result.success, { id: "update-medical" });
      invalidate("lead-intake-medical");
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onMedicalSubmit = useCallback(
    (values: IntakeMedicalInfoSchemaType) => {
      const toastString = "Updating Medical Information...";
      toast.loading(toastString, { id: "update-medical" });
      medicalMutate(values);
    },
    [medicalMutate]
  );

  return {
    doctorIsPending,
    onDoctorSubmit,
    bankIsPending,
    onBankSubmit,
    otherIsPending,
    onOtherSubmit,
    medicalIsPending,
    onMedicalSubmit,
  };
};

export const useLeadIntakePersonalActions = () => {
  const { leadId, onIntakeDialogClose } = useLeadStore();
  const queryClient = useQueryClient();

  // const invalidate = (key: string) => {
  //   queryClient.invalidateQueries({
  //     queryKey: [`${key}-${leadId}`],
  //   });
  // };

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [`lead-intake-personal-${leadId}`],
    });
  };

  //GENERAL INFO
  const { mutate: generalMutate, isPending: generalIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeGeneral,
    onSuccess: (results) => {
      toast.success(results.success, { id: "update-general" });
      // invalidate("lead-intake-general");
      invalidate();
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onGeneralSubmit = useCallback(
    (values: IntakeGeneralSchemaType) => {
      toast.loading("Updating General Information...", {
        id: "update-general",
      });
      generalMutate(values);
    },
    [generalMutate]
  );

  //PERSONAL INFO
  const { mutate: personalMutate, isPending: personalIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakePersonal,
    onSuccess: (result) => {
      toast.success(result.success, { id: "update-personal" });
      // invalidate("lead-intake-personal");
      invalidate();
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onPersonalSubmit = useCallback(
    (values: IntakePersonalSchemaType) => {
      toast.loading("Updating Personal Information...", {
        id: "update-personal",
      });
      personalMutate(values);
    },
    [personalMutate]
  );

  //EMPLOYEMENT INFO
  const { mutate: employmentMutate, isPending: employmentIsPending } =
    useMutation({
      mutationFn: leadUpdateByIdIntakeEmployment,
      onSuccess: (results) => {
        toast.success(results.success, { id: "update-employment" });
        // invalidate("lead-intake-employment");
        invalidate();
        onIntakeDialogClose();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onEmploymentSubmit = useCallback(
    (values: IntakeEmploymentSchemaType) => {
      toast.loading("Updating Employment Information...", {
        id: "update-employment",
      });
      employmentMutate(values);
    },
    [employmentMutate]
  );

  //EMPLOYEMENT INFO
  const { mutate: miscMutate, isPending: miscIsPending } = useMutation({
    mutationFn: leadUpdateByIdIntakeMisc,
    onSuccess: (results) => {
      toast.success(results.success, { id: "update-misc" });
      // invalidate("lead-intake-misc");
      invalidate();
      onIntakeDialogClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onMiscSubmit = useCallback(
    (values: IntakeMiscSchemaType) => {
      toast.loading("Updating Misc Information...", {
        id: "update-misc",
      });
      miscMutate(values);
    },
    [miscMutate]
  );

  return {
    generalIsPending,
    onGeneralSubmit,
    personalIsPending,
    onPersonalSubmit,
    employmentIsPending,
    onEmploymentSubmit,
    miscIsPending,
    onMiscSubmit,
  };
};
