import * as z from "zod";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { emitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";

import { LeadPolicySchema } from "@/schemas";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LeadPolicyInfo } from "@/types";
import { leadUpdateByIdPolicyInfo } from "@/actions/lead";
import { useGlobalContext } from "@/providers/global";
import { Calendar } from "@/components/ui/calendar";

type PolicyInfoFormProps = {
  policyInfo: LeadPolicyInfo;
  onClose: () => void;
};

type PolicyInfoFormValues = z.infer<typeof LeadPolicySchema>;

export const PolicyInfoForm = ({
  policyInfo,
  onClose,
}: PolicyInfoFormProps) => {
  const { carriers } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const form = useForm<PolicyInfoFormValues>({
    resolver: zodResolver(LeadPolicySchema),
    defaultValues: policyInfo,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = (values: PolicyInfoFormValues) => {
    setLoading(true);
    leadUpdateByIdPolicyInfo(values).then((data) => {
      if (data.success) {
        emitter.emit("policyInfoUpdated", {
          ...data.success,
          startDate: data.success?.startDate || undefined,
        });
        emitter.emit("leadStatusChanged", data.success.leadId, "Sold");

        toast.success("Lead Policy Info Updated");
        onClose();
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
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
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
                    disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
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
            <Button disabled={loading} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
