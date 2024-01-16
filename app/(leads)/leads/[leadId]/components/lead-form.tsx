"use client";
import { useState, useEffect } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@prisma/client";

import { LeadSchema } from "@/schemas";

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

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type LeadFormValues = z.infer<typeof LeadSchema>;

interface LeadFormProps {
  initialData: Lead | null;
}

export const LeadForm = ({ initialData }: LeadFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const toastMessage = initialData ? "Lead updated." : "Lead created.";
  const action = initialData ? "Update" : "Create";

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(LeadSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      homePhone: "",
      cellPhone: "",
      gender: "",
      maritalStatus: "",
      email: "",
    },
  });

  const onSubmit = async (values: LeadFormValues) => {
    try {
      setLoading(true);
      let lead = "";
      if (initialData) {
        await axios.patch(`/api/leads/${params.leadId}`, values);
      } else {
        const newlead = await axios.post(`/api/leads`, values);
        const l = newlead.data;
        lead = `/${l.id}`;
      }
      router.refresh();
      router.push(`/leads${lead}`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }

    setIsDisabled(true);
  };

  useEffect(() => {
    if (!initialData) {
      setIsDisabled(false);
    }
  }, []);
  return (
    <div>
      <Form {...form}>
        <form
          className="space-y-6 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
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
                        disabled={loading || isDisabled}
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
                        disabled={loading || isDisabled}
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
                    <Select
                      name="ddlGender"
                      disabled={loading || isDisabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={loading || isDisabled}
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              {/* HOMEPHONE */}
              <FormField
                control={form.control}
                name="homePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Home Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="457-458-9695"
                        disabled={loading || isDisabled}
                        autoComplete="phone"
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
                        disabled={loading || isDisabled}
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
                    <FormLabel> Marital Status</FormLabel>
                    <Select
                      name="ddlMaritalStatus"
                      disabled={loading || isDisabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
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
                        disabled={loading || isDisabled}
                        autoComplete="email"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
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
                        disabled={loading || isDisabled}
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
                        disabled={loading || isDisabled}
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
                    <FormLabel> State</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="VA"
                        disabled={loading || isDisabled}
                        autoComplete="address-level1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="15468"
                        disabled={loading || isDisabled}
                        autoComplete="postal-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-x-2 justify-center">
            {isDisabled && initialData ? (
              <Button onClick={() => setIsDisabled(false)} variant="outline">
                Edit
              </Button>
            ) : (
              <div className="flex gap-x-2">
                {initialData && (
                  <Button onClick={() => setIsDisabled(true)} variant="outline">
                    Cancel
                  </Button>
                )}
                <Button disabled={loading} type="submit">
                  {action}
                </Button>
              </div>
            )}
          </div>
        </form>
      </Form>

      {/* <div className="flex w-full justify-evenly">
        <div className="flex flex-col w-[25%] gap-y-2 px-2">
          <Input value={lead.firstName} type="text" />
          {JSON.stringify(lead)}
        </div>
      </div> */}
    </div>
  );
};
