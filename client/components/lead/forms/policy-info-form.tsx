"use client";
import { useEffect, useState } from "react";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCarriers } from "@/components/global/selects/hooks/use-carriers";
import {
  useLeadPolicyActions,
  useLeadPolicyData,
} from "@/hooks/lead/use-policy-info";

import { LeadPolicy } from "@prisma/client";
import { LeadPolicySchema, LeadPolicySchemaType } from "@/schemas/lead";
import { FullUserCarrier } from "@/types";

import { Button } from "@/components/ui/button";
import CustomDialogHeader from "@/components/custom-dialog-header";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CarrierSelect } from "@/components/global/selects/carriers";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";

export const PolicyInfoForm = () => {
  const { policy, isFetchingPolicy } = useLeadPolicyData();
  const { isPolicyFormOpen, onPolicyFormClose } = useLeadPolicyActions();
  const { leadId, leadFullName } = useLeadStore();

  return (
    <Dialog open={isPolicyFormOpen} onOpenChange={onPolicyFormClose}>
      <DialogContent>
        <CustomDialogHeader
          icon={User}
          title="Policy Info"
          subTitle={leadFullName}
        />
        <SkeletonWrapper isLoading={isFetchingPolicy}>
          <PolicyForm
            policy={policy}
            leadId={policy?.lead.id || leadId!}
            onClose={onPolicyFormClose}
          />
        </SkeletonWrapper>
      </DialogContent>
    </Dialog>
  );
};

type Props = {
  policy: LeadPolicy | null | undefined;
  leadId: string;
  onClose: () => void;
};
const PolicyForm = ({ policy, leadId, onClose }: Props) => {
  const { carriers } = useCarriers();
  const [carrier, setCarrier] = useState<FullUserCarrier | undefined>(
    undefined
  );
  const { onPolicySubmit, policyIsPending } = useLeadPolicyActions();

  const form = useForm<LeadPolicySchemaType>({
    resolver: zodResolver(LeadPolicySchema),
    //@ts-ignore
    defaultValues: policy || {
      leadId: leadId,
      coverageAmount: 0,
      ap: "0",
      commision: "0",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const calcAp = parseInt(form.watch("coverageAmount"), 0) * 12;
  const ap = calcAp.toString();
  const commision = carrier
    ? Math.floor(calcAp * (carrier.rate / 100)).toString()
    : "0";

  const onSubmit = (values: LeadPolicySchemaType) => {
    values.ap = ap;
    values.commision = commision;
    onPolicySubmit(values);
  };
  useEffect(() => {
    if (!policy) return;
    setCarrier(carriers?.find((c) => c.carrierId == policy.carrierId));
  }, [policy]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ScrollArea className="flex-1 max-h-[350px]">
          <div className="grid grid-cols-2 gap-3">
            {/* CARRIER */}
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem className=" col-span-2">
                  <FormLabel className="flex justify-between">
                    Carrier
                    <FormMessage />
                  </FormLabel>
                  <CarrierSelect
                    defaultValue={field.value}
                    onValueChange={(e) => {
                      setCarrier(carriers?.find((c) => c.carrierId == e));
                      field.onChange(e);
                    }}
                    disabled={policyIsPending}
                  />
                </FormItem>
              )}
            />

            {/* COVERAGE AMOUNT */}
            <FormField
              control={form.control}
              name="coverageAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Coverage Amount
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="flex-1"
                      placeholder="7"
                      disabled={policyIsPending}
                      autoComplete="coverageAmount"
                      type="number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* POLICY NUMBER */}
            <FormField
              control={form.control}
              name="policyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Policy Number
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="EX2548745"
                      disabled={policyIsPending}
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
                  <FormLabel className="flex justify-between">
                    Status
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlStatus"
                    disabled={policyIsPending}
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
                </FormItem>
              )}
            />

            {/* START DATE */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Start Date
                    <FormMessage />
                  </FormLabel>
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
                </FormItem>
              )}
            />

            {/* AP */}
            <FormField
              control={form.control}
              name="ap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Ap
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                      {...field}
                      placeholder="120"
                      disabled={loading}
                      autoComplete="ap"
                      type="number"
                    /> */}
                    <Input
                      onChange={field.onChange}
                      value={ap.toString()}
                      placeholder="120"
                      disabled
                      autoComplete="ap"
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
                  <FormLabel className="flex justify-between">
                    Commision {carrier && <>({carrier.rate}%)</>}
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                      {...field}
                      placeholder="52"
                      disabled={loading}
                      autoComplete="commision"
                      type="number"
                    /> */}
                    <Input
                      onChange={field.onChange}
                      value={commision}
                      placeholder="120"
                      disabled
                      autoComplete="commision"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={policyIsPending} type="submit">
            {policy ? "Update" : "Create"} Policy
          </Button>
        </div>
      </form>
    </Form>
  );
};
