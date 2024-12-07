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
import { getLeadBeneficiaries } from "@/actions/lead/beneficiary";

export const useLeadIntakeData = () => {
  const { leadId } = useLeadStore();
  const onPersonalGet = () => {
    const {
      data: personal,
      isFetching: personalFetching,
      isLoading: personalLoading,
    } = useQuery<IntakePersonalMainSchemaType | null>({
      queryKey: [`lead-intake-personal-${leadId}`],
      queryFn: () => leadGetByIdIntakePersonalInfo(leadId as string),
      enabled:!!leadId
    });
    return { personal, personalFetching, personalLoading };
  };
  const onBeneficiariesGet = () => {
    const {
      data: beneficiaries,
      isFetching: beneficiariesFetching,
      isLoading: beneficiariesLoading,
    } = useQuery<LeadBeneficiary[]>({
      queryKey: [`lead-intake-beneficiaries-${leadId}`],
      queryFn: () => getLeadBeneficiaries(leadId as string),enabled:!!leadId
    });
    return { beneficiaries, beneficiariesFetching, beneficiariesLoading };
  };
  const onDoctorGet = () => {
    const {
      data: doctor,
      isFetching: doctorFetching,
      isLoading: doctorLoading,
    } = useQuery<IntakeDoctorInfoSchemaType | null>({
      queryKey: [`lead-intake-doctor-${leadId}`],
      queryFn: () => leadGetByIdIntakeDoctorInfo(leadId as string),enabled:!!leadId
    });
    return { doctor, doctorFetching, doctorLoading };
  };
  const onBankGet = () => {
    const {
      data: bank,
      isFetching: bankFetching,
      isLoading: bankLoading,
    } = useQuery<IntakeBankInfoSchemaType | null>({
      queryKey: [`lead-intake-bank-${leadId}`],
      queryFn: () => leadGetByIdIntakeBankInfo(leadId!),enabled:!!leadId
    });
    return { bank, bankFetching, bankLoading };
  };
  const onOtherGet = () => {
    const {
      data: other,
      isFetching: otherFetching,
      isLoading: otherLoading,
    } = useQuery<IntakeOtherInfoSchemaType | null>({
      queryKey: [`lead-intake-other-${leadId}`],
      queryFn: () => leadGetByIdIntakeOtherInfo(leadId as string),enabled:!!leadId
    });
    return { other, otherFetching, otherLoading };
  };
  const onPolicyGet = () => {
    const {
      data: policy,
      isFetching: policyFetching,
      isLoading: policyLoading,
    } = useQuery<FullLeadPolicy | null>({
      queryKey: [`lead-intake-policy-${leadId}`],
      queryFn: () => leadGetByIdIntakePolicyInfo(leadId as string),enabled:!!leadId
    });
    return { policy, policyFetching, policyLoading };
  };
  const onMedicalGet = () => {
    const {
      data: medical,
      isFetching: medicalFetching,
      isLoading: medicalLoading,
    } = useQuery<IntakeMedicalInfoSchemaType | null>({
      queryKey: [`lead-intake-medical-${leadId}`],
      queryFn: () => leadGetByIdIntakeMedicalInfo(leadId as string),enabled:!!leadId
    });

    return { medical, medicalFetching, medicalLoading };
  };
  return {
    onPersonalGet,
    onBeneficiariesGet,
    onDoctorGet,
    onBankGet,
    onOtherGet,
    onPolicyGet,
    onMedicalGet,
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
