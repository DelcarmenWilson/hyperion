import { useCallback } from "react";
import { toast } from "sonner";
import { useInvalidate } from "../use-invalidate";
import { useMutation, useQuery } from "@tanstack/react-query";

import { LeadExpense } from "@prisma/client";
import { GetLeadExpenseResponseType } from "@/app/api/leads/expense/balance/route";
import {
  leadExpenseDeleteById,
  leadExpenseInsertSheet,
  leadExpensesGetAllById,
} from "@/actions/lead/expense";

export const useLeadExpenseData = (leadId: string) => {
 

  const onGetLeadBalance = () => {
    const {
      data: leadBalance,
      isFetching: leadBalanceFetching,
      isLoading: leadBalanceLoading,
    } = useQuery<GetLeadExpenseResponseType>({
      queryFn: () =>
        fetch(`/api/leads/expense/balance?leadId=${leadId}`).then((res) =>
          res.json()
        ),
      queryKey: [`lead-balance-${leadId}`],
      enabled: !!leadId,
    });
    return {
      leadBalance,
      leadBalanceFetching,
      leadBalanceLoading,
    };
  };

  const onGetLeadExpense = () => {
    const {
      data: leadExpense,
      isFetching: leadExpenseFetching,
      isLoading: leadExpenseLoading,
    } = useQuery<LeadExpense[]>({
      queryFn: () => leadExpensesGetAllById(leadId as string),
      queryKey: [`lead-expense-${leadId}`],
    });
    return {
      leadExpense,
      leadExpenseFetching,
      leadExpenseLoading,
    };
  };

  return {
    onGetLeadBalance,
    onGetLeadExpense,
  };
};

export const useLeadExpenseActions = (leadId: string) => {
  const { invalidate } = useInvalidate();

  const { mutate: onCreateLeadExpense, isPending: leadExpenseCreating } =
    useMutation({
      mutationFn: leadExpenseInsertSheet,
      onSuccess: () => {
        toast.success("Expense Sheet Created", {
          id: "create-expense-sheet",
        });
        invalidate(`lead-expense-${leadId}`);
      },
    });

  const { mutate: deleteleadExpense, isPending: leadExpenseDeleting } =
    useMutation({
      mutationFn: leadExpenseDeleteById,
      onSuccess: () => {
        toast.success("Transaction deleted succesfully", {
          id: "delete-transaction",
        });
        invalidate(`lead-expense-${leadId}`);
      },
    });

  const onDeleteLeadExpense = useCallback((id:string) => {
    toast.loading("Deleting transaction...", { id: "delete-transaction" });
    deleteleadExpense(id);
  }, [deleteleadExpense]);

  return {
    onCreateLeadExpense,
    leadExpenseCreating,
     onDeleteLeadExpense,
    leadExpenseDeleting,
  };
};
