import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useLeadStore } from "./use-lead";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { LeadExpense } from "@prisma/client";
import { GetLeadExpenseResponseType } from "@/app/api/leads/expense/balance/route";
import { leadExpenseDeleteById, leadExpenseInsertSheet, leadExpensesGetAllById } from "@/actions/lead/expense";

export const useLeadExpenseActions = () => {
  const { leadId } = useLeadStore();
    const queryClient = useQueryClient();
    
  const [alertOpen, setAlertOpen] = useState(false);  
  const [selectedExpense, setSelectedExpense] = useState<string>("");

  const onSelectedExpense = (id: string) => {
    setSelectedExpense(id);
    setAlertOpen(true);
  };

  const { data: leadBalance, isFetching: isFetchingLeadBalance } = useQuery<GetLeadExpenseResponseType>({
    queryKey: [`leadBalance-${leadId}`],
    queryFn: () =>
      fetch(`/api/leads/expense/balance?leadId=${leadId}`).then((res) =>
        res.json()
      ),
  });


 const { data: leadExpense, isFetching: isFetchingLeadExpense } = useQuery<LeadExpense[]>({
    queryKey: [`leadExpense-${leadId}`],
    queryFn: () => leadExpensesGetAllById(leadId as string),
  });

  const { mutate:leadExpenseMutate, isPending:isPendingExpense } = useMutation({
    mutationFn: leadExpenseInsertSheet,
    onSuccess: () => {
      toast.success("Expense Sheet Created", {
        id: "create-expense-sheet",
      });
      queryClient.invalidateQueries({
        queryKey: [`leadExpense-${leadId}`],
      });
    },
  });

  const { mutate:leadExpenseDelete, isPending:isPendingLeadExpenseDelete } = useMutation({
    mutationFn: leadExpenseDeleteById,
    onSuccess: () => {
      toast.success("Transaction deleted succesfully", {
        id: "delete-transaction",
      });
      queryClient.invalidateQueries({
        queryKey: [`leadExpense-${leadId}`],
      });

      setAlertOpen((prev) => !prev);
    },
  });

  const onExpenseDelete = useCallback(() => {
    toast.loading("Deleting transaction...", { id: "delete-transaction" });
    leadExpenseDelete(selectedExpense);
  }, [leadExpenseDelete, selectedExpense]);

  return {
    leadId,
    alertOpen, setAlertOpen,onSelectedExpense,
    leadBalance,  isFetchingLeadBalance,leadExpense, isFetchingLeadExpense,leadExpenseMutate, isPendingExpense,onExpenseDelete, isPendingLeadExpenseDelete
  };
};
