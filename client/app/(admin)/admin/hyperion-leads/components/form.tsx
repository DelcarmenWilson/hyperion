"use client";
import { useState } from "react";
import { adminEmitter } from "@/lib/event-emmiter";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

import { HyperionLeadSchema, HyperionLeadSchemaType } from "@/schemas/admin";
import { HyperionLead } from "@prisma/client";
import { hyperionLeadUpdateById } from "@/actions/hyperion";

type HyperionLeadFormProps = {
  lead: HyperionLead;
  onClose: () => void;
};

export const HyperionLeadForm = ({ lead, onClose }: HyperionLeadFormProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<HyperionLeadSchemaType>({
    resolver: zodResolver(HyperionLeadSchema),
    //@ts-ignore
    defaultValues: lead,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = async (values: HyperionLeadSchemaType) => {
    setLoading(true);
    hyperionLeadUpdateById(values).then((data) => {
      if (data.success) {
        adminEmitter.emit("hyperionLeadUpdated", data.success);
        toast.success("HyperionLead updated!");
        onClose();
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* FIRSTNAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        disabled={loading}
                        autoComplete="First Name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LASTNAME */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        disabled={loading}
                        autoComplete="Last Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GENDER */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Gender</FormLabel>
                    <Input
                      {...field}
                      placeholder="Male"
                      disabled={loading}
                      autoComplete="Gender"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DATE OF BIRTH */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Dob"
                        disabled={loading}
                        type="date"
                        autoComplete="DateOfBirth"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CELLPHONE */}
              <FormField
                control={form.control}
                name="cellPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Cell Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="555-555-5555"
                        disabled={loading}
                        autoComplete="phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MARITAL STATUS */}
              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Single"
                        disabled={loading}
                        autoComplete="maritalStatus"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="jon.doe@example.com"
                        disabled={loading}
                        autoComplete="email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ADDRESS */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 main street"
                        disabled={loading}
                        autoComplete="address"
                      />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* STATE */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="NY"
                        disabled={loading}
                        autoComplete="state"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WEIGHT */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Weight Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="120"
                        disabled={loading}
                        autoComplete="weight"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HEIGHT */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Height</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="5,5"
                        disabled={loading}
                        autoComplete="height"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* POLICY AMOUNT */}
              <FormField
                control={form.control}
                name="policyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Amount</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="15000"
                        disabled={loading}
                        autoComplete="policyAmount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SMOKER */}
              <FormField
                control={form.control}
                name="smoker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Smoker</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="No"
                        disabled={loading}
                        autoComplete="smoker"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
