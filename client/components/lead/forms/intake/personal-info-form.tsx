import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ReactDatePicker from "react-datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  IntakePersonalInfoSchema,
  IntakePersonalInfoSchemaType,
} from "@/schemas/lead";

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
import { MaritalStatus } from "@prisma/client";

import { states } from "@/constants/states";
import { leadUpdateByIdIntakePersonalInfo } from "@/actions/lead/intake";

type PersonalInfoFormProps = {
  info: IntakePersonalInfoSchemaType;
  onClose: () => void;
};

export const PersonalInfoForm = ({ info, onClose }: PersonalInfoFormProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: leadUpdateByIdIntakePersonalInfo,
    onSuccess: (result) => {
      toast.success(result.success, {
        id: "update-personal-info",
      });

      queryClient.invalidateQueries({
        queryKey: ["leadInfo", `lead-${info.id}`, "leadIntakePersonalInfo"],
      });

      onCancel();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<IntakePersonalInfoSchemaType>({
    resolver: zodResolver(IntakePersonalInfoSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  const onSubmit = useCallback(
    (values: IntakePersonalInfoSchemaType) => {
      const toastString = "Updating Personal Information...";
      toast.loading(toastString, { id: "update-personal-info" });

      mutate(values);
    },
    [mutate]
  );
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Form {...form}>
        <form
          className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Tabs
            defaultValue="general"
            className="flex flex-1 flex-col h-full overflow-hidden"
          >
            <TabsList className="flex flex-col lg:flex-row w-full h-auto">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="misc">Misc</TabsTrigger>
            </TabsList>

            <TabsContent
              className="flex-1 w-full h-full overflow-y-auto"
              value="general"
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
                          disabled={isPending}
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
                          disabled={isPending}
                          autoComplete="lastName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
                        autoComplete="address-level2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2 justify-between">
                {/* STATE */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        name="ddlState"
                        disabled={isPending}
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
                          disabled={isPending}
                          autoComplete="postal-code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* DATE OF BIRTH */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of birth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Dob"
                          disabled={isPending}
                          type="date"
                          autoComplete="DateOfBirth"
                        />
                      </FormControl>
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
                      <Select
                        name="ddlMaritalStatus"
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Marital status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={MaritalStatus.Single}>
                            Single
                          </SelectItem>
                          <SelectItem value={MaritalStatus.Married}>
                            Married
                          </SelectItem>
                          <SelectItem value={MaritalStatus.Divorced}>
                            Divorced
                          </SelectItem>
                          <SelectItem value={MaritalStatus.Widowed}>
                            Widowed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PLACE OF BIRTH */}
                <FormField
                  control={form.control}
                  name="placeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place Of Birth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Country"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* STATE OF BIRTH */}
                <FormField
                  control={form.control}
                  name="stateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth State</FormLabel>
                      <Select
                        name="ddlBirthState"
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        autoComplete="off"
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
              </div>
            </TabsContent>
            <TabsContent
              className="flex-1 w-full h-full overflow-y-auto"
              value="personal"
            >
              <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                {/* SSN */}
                <FormField
                  control={form.control}
                  name="ssn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SSN#</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ssn"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DRIVERS LICENSE NUMBER */}
                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drivers License</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DF584-8596-45"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DRIVERS LICENSE STATE */}
                <FormField
                  control={form.control}
                  name="licenseState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        name="ddlLicenseState"
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        autoComplete="off"
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

                {/* DRIVERS LICENSE */}
                <FormField
                  control={form.control}
                  name="licenseExpires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <ReactDatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="MM-dd-yyyy"
                          placeholderText="6/9/2024"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent
              className="flex-1 w-full h-full overflow-y-auto"
              value="employment"
            >
              <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                {/* ANNUAL INCOME */}
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Income</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="50,000"
                          disabled={isPending}
                          autoComplete="off"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EXPEREIENCE INCOME */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="experience"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NET WORTH */}
                <FormField
                  control={form.control}
                  name="netWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Worth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="150,000"
                          disabled={isPending}
                          autoComplete="off"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EMPLOYER NAME */}
                <FormField
                  control={form.control}
                  name="employer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employer</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="work"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EMPLOYER ADDRESS */}
                <FormField
                  control={form.control}
                  name="employerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="121 north st"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* EMPLOYER PHONE */}
                <FormField
                  control={form.control}
                  name="employerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone#</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="359-895-5625"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* OCCUPATION */}
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Sales"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            <TabsContent
              className="flex-1 w-full h-full overflow-y-auto"
              value="misc"
            >
              <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
                {/* GREEN CARD NUMBER */}
                <FormField
                  control={form.control}
                  name="greenCardNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Green Card#</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="gfh5868"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* YEARS IN  THE USA */}
                <FormField
                  control={form.control}
                  name="yearsInUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>years In USA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CITIZENSHIP */}
                <FormField
                  control={form.control}
                  name="citizenShip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Citizen Ship </FormLabel>
                      <FormControl>
                        <Select
                          name="ddlState"
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          autoComplete="off"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectItem value="citizen">US Citizen</SelectItem>
                            <SelectItem value="non-citizen">
                              Non-Citizen
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* PARENTS LIVING */}
                <FormField
                  control={form.control}
                  name="parentLiving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parents Living? </FormLabel>
                      <FormControl>
                        <Select
                          name="ddlParentsLiving"
                          disabled={isPending}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          autoComplete="off"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Parents Living" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* FATHERS AGE */}
                <FormField
                  control={form.control}
                  name="fatherAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fathers Age</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="60"
                          disabled={isPending}
                          autoComplete="off"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* MOTHERS AGE */}
                <FormField
                  control={form.control}
                  name="motherAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mothers Age</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="59"
                          disabled={isPending}
                          autoComplete="off"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CUASE OF DEATH */}
                <FormField
                  control={form.control}
                  name="cuaseOfDeath"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuase Of Death</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="cuase"
                          disabled={isPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outlineprimary">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
