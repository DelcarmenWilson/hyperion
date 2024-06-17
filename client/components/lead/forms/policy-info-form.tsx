import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";

import { LeadPolicySchema, LeadPolicySchemaType } from "@/schemas/lead";
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

import { leadUpdateByIdPolicyInfo } from "@/actions/lead";
import { useGlobalContext } from "@/providers/global";

type PolicyInfoFormProps = {
  policyInfo: LeadPolicySchemaType;
  onClose: () => void;
};

export const PolicyInfoForm = ({
  policyInfo,
  onClose,
}: PolicyInfoFormProps) => {
  const { carriers } = useGlobalContext();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: leadUpdateByIdPolicyInfo,
    onSuccess: (result) => {
      if (result.success) {
        userEmitter.emit("policyInfoUpdated", {
          ...result.success,
          startDate: result.success?.startDate || undefined,
        });
        userEmitter.emit("leadStatusChanged", result.success.leadId, "Sold");

        toast.success("Lead Policy Info Updated", {
          id: "update-policy-info",
        });

        queryClient.invalidateQueries({
          queryKey: [
            "leadInfo",
            `lead-${policyInfo.leadId}`,
            "leadIntakePolicy",
          ],
        });

        onClose();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<LeadPolicySchemaType>({
    resolver: zodResolver(LeadPolicySchema),
    defaultValues: policyInfo,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = useCallback(
    (values: LeadPolicySchemaType) => {
      const toastString = "Updating Policy Information...";
      toast.loading(toastString, { id: "update-policy-info" });

      mutate(values);
    },
    [mutate]
  );
  return (
    <div className="h-full overflow-y-auto">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-2">
            {/* CARRIER */}
            <FormField
              control={form.control}
              name="carrier"
              render={({ field }) => (
                <FormItem className=" col-span-2">
                  <FormLabel>Carrier</FormLabel>
                  <Select
                    name="ddlCarrier"
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a carrier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carriers?.map((carrier) => (
                        <SelectItem
                          key={carrier.id}
                          value={carrier.carrier.name}
                        >
                          {carrier.carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CARRIER */}
            {/* <FormField
              control={form.control}
              name="carrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Mutual"
                      disabled={loading}
                      autoComplete="carrier"
                      type="text"
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {/* COVERAGE AMOUNT */}
            <FormField
              control={form.control}
              name="coverageAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coverage Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="flex-1"
                      placeholder="7"
                      disabled={isPending}
                      autoComplete="coverageAmount"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* POLICY NUMBER */}
            <FormField
              control={form.control}
              name="policyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Number</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="EX2548745"
                      disabled={isPending}
                      autoComplete="policyNumber"
                      type="text"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="ddlStatus"
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* START DATE */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <ReactDatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MM-d-yyyy"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholderText="Select a Date"
                    />
                  </FormControl>
                  {/* <Popover>
                    <FormControl>
                      <div className="flex-1 relative">
                        <Input
                          value={
                            field.value
                              ? format(field.value, "MM-dd-yy")
                              : "Pick a date"
                          }
                        />
                        <PopoverTrigger asChild>
                          <CalendarIcon
                            size={16}
                            className="absolute opacity-50 right-2 top-0 translate-y-1/2 cursor-pointer"
                          />
                        </PopoverTrigger>
                      </div>
                    </FormControl>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* AP */}
            <FormField
              control={form.control}
              name="ap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ap</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="120"
                      disabled={isPending}
                      autoComplete="ap"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* COMMISION */}
            <FormField
              control={form.control}
              name="commision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Commision</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="52"
                      disabled={isPending}
                      autoComplete="commision"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
