import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LeadMainSchema, LeadMainSchemaType } from "@/schemas/lead";
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

import { leadUpdateByIdMainInfo } from "@/actions/lead";

import { states } from "@/constants/states";

type MainInfoFormProps = {
  info: LeadMainSchemaType;
  onClose: () => void;
};

export const MainInfoForm = ({ info, onClose }: MainInfoFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<LeadMainSchemaType>({
    resolver: zodResolver(LeadMainSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: LeadMainSchemaType) => {
    setLoading(true);
    const response = await leadUpdateByIdMainInfo(values);
    if (response.success) {
      userEmitter.emit("mainInfoUpdated", response.success);
      toast.success("Lead demographic info updated");
      onClose();
    } else {
      form.reset();
      toast.error(response.error);
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-auto">
      <Form {...form}>
        <form
          className="space-y-2 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            {/* FIRST NAME */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="first name"
                      disabled={loading}
                      autoComplete="firstName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LAST NAME */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="last name"
                      disabled={loading}
                      autoComplete="lastName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CELLPHONE */}
          <FormField
            control={form.control}
            name="cellPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone #</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="347-859-8547"
                    disabled={loading}
                    autoComplete="phone"
                    // pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$"
                  />
                </FormControl>
              </FormItem>
            )}
          />

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
