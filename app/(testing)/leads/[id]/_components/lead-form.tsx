"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeftIcon, CalendarIcon } from "@radix-ui/react-icons";

import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@prisma/client";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LeadSchema } from "@/schemas";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
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
import { leadUpdateById } from "@/actions/lead";
import { toast } from "sonner";

interface LeadFormProps {
  lead: Lead;
}

export const LeadForm = ({ lead }: LeadFormProps) => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof LeadSchema>>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      address: lead.address||undefined,
      city: lead.city||undefined,
      state: lead.state,
      zipCode: lead.zipCode,
      county: lead.county || undefined,
      homePhone: lead.homePhone || undefined,
      cellPhone: lead.cellPhone,
      gender: lead.gender || undefined,
      maritalStatus: lead.maritalStatus || undefined,
      email: lead.email,
      dateOfBirth: lead.dateOfBirth || undefined,
      updatedBy: user?.id,
    },
  });

  const onSubmit = (values: z.infer<typeof LeadSchema>) => {
    toast.success("just cliked the update button")
    console.log(values)
    // startTransition(() => {
    //   leadUpdateById(values)
    //     .then((data) => {
    //       if (data.error) {
    //         toast.error(data.error);
    //       }
    //       if (data.success) {
    //         toast.success(data.success);
    //         update();
    //       }
    //     })
    //     .catch(() => {
    //       toast.error("Something went wrong");
    //     });
    // });

    setIsDisabled(true)
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Link href="/leads">
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
        <h2>
          {lead.firstName} {lead.lastName}
        </h2>
        <div>
          <Button>call</Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-evenly items-center space-4">
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="John"
                        disabled={isPending||isDisabled}
                        autoComplete="FirstName"
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="Doe"
                        disabled={isPending || isDisabled}
                        autoComplete="LastName"
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
                      disabled={isPending || isDisabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="border-[#202020]">
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
                        <FormControl className="border-[#202020]">
                          <Button
                            disabled={isPending || isDisabled}
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="457-458-9695"
                        disabled={isPending || isDisabled}
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="555-555-5555"
                        disabled={isPending || isDisabled}
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
                      disabled={isPending || isDisabled}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="border-[#202020]">
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="jon.doe@example.com"
                        disabled={isPending || isDisabled}
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="123 main street"
                        disabled={isPending || isDisabled}
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="Queens"
                        disabled={isPending || isDisabled}
                        autoComplete="city"
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="VA"
                        disabled={isPending || isDisabled}
                        autoComplete="state"
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
                        className="border-[#202020]"
                        {...field}
                        placeholder="15468"
                        disabled={isPending || isDisabled}
                        autoComplete="zip"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="text-center">
            {isDisabled ? (
              <Button onClick={()=>setIsDisabled(false)} variant="outline">Edit</Button>
            ) : (
              <div>
                <Button onClick={()=>setIsDisabled(true)} variant="outline"> Cancel</Button>
                <Button disabled={isPending} type="submit">Update</Button>
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
