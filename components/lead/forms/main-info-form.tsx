import * as z from "zod";
import { useState } from "react";

import { emitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadMainSchema } from "@/schemas";
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

import { LeadMainInfo } from "@/types";
import { leadUpdateByIdMainInfo } from "@/actions/lead";

import { states } from "@/constants/states";

type MainInfoFormProps = {
  info: LeadMainInfo;
  onClose: () => void;
};

type MainInfoFormValues = z.infer<typeof LeadMainSchema>;

export const MainInfoForm = ({ info, onClose }: MainInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<MainInfoFormValues>({
    resolver: zodResolver(LeadMainSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: MainInfoFormValues) => {
    setLoading(true);
    await leadUpdateByIdMainInfo(values).then((data) => {
      if (data.success) {
        emitter.emit("mainInfoUpdated", {
          ...data.success,
          email: data.success.email?.toString(),
          address: data.success.address?.toString(),
          city: data.success.city?.toString(),
          zipCode: data.success.zipCode?.toString(),
        });

        toast.success("Lead demographic info updated");
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
              <FormItem>
                <FormLabel> City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Queens"
                    disabled={loading}
                    autoComplete="address-level2"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* STATE */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    name="ddlState"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="address-level2"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
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
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
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
