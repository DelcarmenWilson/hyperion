"use client";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGlobalContext } from "@/providers/global-provider";

import { UserLicense } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";
import { Input } from "@/components/ui/input";
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
import { DataTable } from "@/components/custom/data-table";

import { UserLicenseSchema } from "@/schemas";
import { states } from "@/constants/states";
import { columns } from "./license-columns";
import { userLicenseInsert } from "@/actions/user";

type LicenseFormProps = {
  initLicenses: UserLicense[];
};

type LicenseFormValues = z.infer<typeof UserLicenseSchema>;
export const LicenseForm = ({ initLicenses }: LicenseFormProps) => {
  const [loading, setLoading] = useState(false);
  const { licenses, setLicenses } = useGlobalContext();
  // const [licenses, setLicenses] = useState(initLicenses);

  const form = useForm<LicenseFormValues>({
    resolver: zodResolver(UserLicenseSchema),
    defaultValues: {
      state: "",
      type: "",
      licenseNumber: "",
      dateExpires: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
  };
  const onSubmit = async (values: LicenseFormValues) => {
    setLoading(true);
    await userLicenseInsert(values).then((data) => {
      if (data.success) {
        setLicenses((licenses) => {
          return [...licenses!, data.success];
        });
        toast.success("License createwd");
      }
      if (data.error) {
        toast.error(data.error);
      }
    });
    form.reset();
    setLoading(false);
  };

  return (
    <div>
      <Heading title={"Licences"} description="Manage all your licenses" />
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-2">
          <Form {...form}>
            <form
              className="space-6 px-2 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-2">
                {/* STATE */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        State
                        <FormMessage />
                      </FormLabel>
                      <Select
                        name="ddlState"
                        disabled={loading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        autoComplete="address-level1"
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
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
                    </FormItem>
                  )}
                />

                {/* TYPE */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex justify-between items-center">
                        Type
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Life/accident/health"
                          disabled={loading}
                          autoComplete="Type"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* LICENSE NUMBER*/}
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel className="flex justify-between items-center">
                        Number
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="124548"
                          disabled={loading}
                          type="text"
                          autoComplete="licenseNumber"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* DATE EXPIRES */}
                <FormField
                  control={form.control}
                  name="dateExpires"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel className="flex justify-between items-center">
                        Expiration Date
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="12/05/2025"
                          disabled={loading}
                          type="date"
                          autoComplete="expiraionDate"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
        <div className="col-span-2">
          <DataTable
            columns={columns}
            data={licenses!}
            searchKey="licenseNumber"
          />
        </div>
      </div>
    </div>
  );
};
