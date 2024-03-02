import * as z from "zod";
import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadSaleSchema } from "@/schemas";
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
import { allVendors } from "@/constants/lead";

import { LeadSaleInfo } from "@/types";
import { leadUpdateByIdSaleInfo } from "@/actions/lead";

type SaleInfoFormProps = {
  saleInfo: LeadSaleInfo;
  onChange: (e?: LeadSaleInfo) => void;
};

type SalenfoFormValues = z.infer<typeof LeadSaleSchema>;

export const SaleInfoForm = ({ saleInfo, onChange }: SaleInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<SalenfoFormValues>({
    resolver: zodResolver(LeadSaleSchema),
    defaultValues: saleInfo,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onChange) {
      onChange();
    }
  };

  const onSubmit = async (values: SalenfoFormValues) => {
    setLoading(true);
    await leadUpdateByIdSaleInfo(values).then((data) => {
      if (data.success) {
        if (onChange) {
          onChange(data.success);
        }
        toast.success("Lead info Updated");
      }
      if (data.error) {
        form.reset();
        toast.error(data.error);
      }
    });

    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-1 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-1">
              {/* VENDOR */}
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <Select
                      name="ddlVendor"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-6 p-1">
                          <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allVendors.map((vendor) => (
                          <SelectItem key={vendor.name} value={vendor.value}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SALE AMOUNT */}
              <FormField
                control={form.control}
                name="saleAmount"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Sale Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="120"
                        disabled={loading}
                        autoComplete="saleAmount"
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
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]"> Commision</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="52"
                        disabled={loading}
                        autoComplete="commision"
                        type="number"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* COST OF LEAD */}
              <FormField
                control={form.control}
                name="costOfLead"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[100px]">Cost Lead</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="7"
                        disabled={loading}
                        autoComplete="costOfLead"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
