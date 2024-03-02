import * as z from "zod";
import { useState } from "react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadGeneralSchema, LeadMainSchema } from "@/schemas";
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
import { Gender, MaritalStatus } from "@prisma/client";

import { LeadGeneralInfo, LeadMainInfo } from "@/types";
import {
  leadUpdateByIdGeneralInfo,
  leadUpdateByIdMainInfo,
} from "@/actions/lead";

import { Switch } from "@/components/ui/switch";
import { states } from "@/constants/states";

type MainInfoFormProps = {
  info: LeadMainInfo;
  onChange: (e?: LeadMainInfo) => void;
};

type MainInfoFormValues = z.infer<typeof LeadMainSchema>;

export const MainInfoForm = ({ info, onChange }: MainInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<MainInfoFormValues>({
    resolver: zodResolver(LeadMainSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onChange) {
      onChange();
    }
  };

  const onSubmit = async (values: MainInfoFormValues) => {
    setLoading(true);
    await leadUpdateByIdMainInfo(values).then((data) => {
      if (data.success) {
        if (onChange) {
          onChange({
            ...data.success,
            email: data.success.email?.toString(),
            address: data.success.address?.toString(),
            city: data.success.city?.toString(),
            zipCode: data.success.zipCode?.toString(),
          });
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
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="jon.doe@example.com"
                        disabled={loading}
                        autoComplete="email"
                        type="email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="123 main street"
                        disabled={loading}
                        autoComplete="address"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* CITY */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[50px]"> City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="Queens"
                        disabled={loading}
                        autoComplete="address-level2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[50px]">State</FormLabel>
                    <Select
                      name="ddlState"
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      autoComplete="address-level2"
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1 h-6 p-1">
                          <SelectValue placeholder="Select a State" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.abv} value={state.abv}>
                            {state.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIPCODE */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex gap-x-1 items-end">
                    <FormLabel className="w-[50px]">Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="flex-1 h-6"
                        placeholder="15468"
                        disabled={loading}
                        autoComplete="postal-code"
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
