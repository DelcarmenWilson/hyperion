import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { FullLeadMedicalCondition } from "@/types";
import { MedicalCondition } from "@prisma/client";

import { LeadConditionSchema, LeadConditionSchemaType } from "@/schemas/lead";

import {
  leadConditionInsert,
  leadConditionUpdateById,
} from "@/actions/lead/condition";
import { adminMedicalConditionsGetAll } from "@/actions/admin/medical";

type ConditionFormProps = {
  leadId?: string;
  condition?: FullLeadMedicalCondition;
  onClose: () => void;
};

export const ConditionForm = ({
  leadId,
  condition,
  onClose,
}: ConditionFormProps) => {
  const queryClient = useQueryClient();
  const [conditions, setConditions] = useState<MedicalCondition[]>();
  const btnTitle = condition ? "Update" : "Add";

  const conditionsQuery = useQuery<MedicalCondition[]>({
    queryKey: ["adminConditions"],
    queryFn: () => adminMedicalConditionsGetAll(),
  });
  console.log(conditionsQuery.data);
  const { mutate, isPending } = useMutation({
    mutationFn: condition ? leadConditionUpdateById : leadConditionInsert,
    onSuccess: () => {
      const toastString = condition
        ? "Condition updated successfully"
        : "Condition created successfully";

      toast.success(toastString, {
        id: "insert-update-condition",
      });

      queryClient.invalidateQueries({
        queryKey: ["leadConditions", `lead-${leadId}`],
      });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<LeadConditionSchemaType>({
    resolver: zodResolver(LeadConditionSchema),
    defaultValues: condition || {
      leadId: leadId,
      conditionId: "",
      diagnosed: "",
      medications: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };
  const onSubmit = useCallback(
    (values: LeadConditionSchemaType) => {
      const toastString = condition
        ? "Updating Condition..."
        : "Creating Condition...";
      toast.loading(toastString, { id: "insert-update-condition" });

      mutate(values);
    },
    [mutate]
  );

  // const onSubmit = async (values: LeadConditionSchemaType) => {
  //   setLoading(true);

  //   if (leadId) {
  //     leadConditionInsert(values).then((data) => {
  //       if (data.success) {
  //         userEmitter.emit("conditionInserted", data.success);
  //         toast.success(" Condition Added!");
  //         onClose();
  //       }
  //       if (data.error) {
  //         form.reset();
  //         toast.error(data.error);
  //       }
  //     });
  //   } else {
  //     leadConditionUpdateById(values).then((data) => {
  //       if (data.success) {
  //         userEmitter.emit("conditionUpdated", data.success);
  //         toast.success(" Condition Updated!");
  //         onClose();
  //       }
  //       if (data.error) {
  //         toast.error(data.error);
  //       }
  //     });
  //   }

  //   setLoading(false);
  // };

  // useEffect(() => {
  //   axios.post("/api/admin/conditions").then((response) => {
  //     setConditions(response.data);
  //   });
  // }, []);
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* CONDITION */}
              <FormField
                control={form.control}
                name="conditionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Condition
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlCondition"
                      disabled={conditionsQuery.isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {conditionsQuery.data?.map((condition) => (
                          <SelectItem key={condition.id} value={condition.id}>
                            {condition.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* DATE OF BIRTH */}
              <FormField
                control={form.control}
                name="diagnosed"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel className="flex items-center justify-between">
                      Date Diagnosed
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Diagnosed"
                        disabled={isPending}
                        type="date"
                        autoComplete="Diagnosed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Medications */}
              <FormField
                control={form.control}
                name="medications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Medications
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="medications"
                        disabled={isPending}
                        autoComplete="off"
                        rows={5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Notes
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="notes"
                        disabled={isPending}
                        autoComplete="off"
                        rows={5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {btnTitle}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
