"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useLeadStore,
  useLeadData,
  useLeadInsertActions,
} from "@/hooks/lead/use-lead";

import { Gender, MaritalStatus } from "@prisma/client";
import { LeadSchema, LeadSchemaType } from "@/schemas/lead";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonWrapper from "@/components/skeleton-wrapper";

import { states } from "@/constants/states";
import { leadRelationShips } from "@/constants/lead";

export const NewLeadForm = () => {
  const { isNewLeadFormOpen, onNewLeadFormClose, associatedLead } =
    useLeadStore();
  const { leadBasic, isFetchingLeadBasic } = useLeadData();

  return (
    <DrawerRight
      title="New Lead"
      isOpen={isNewLeadFormOpen}
      onClose={onNewLeadFormClose}
    >
      <SkeletonWrapper isLoading={isFetchingLeadBasic}>
        {leadBasic && (
          <div className="bg-gradient-to-tr from-foreground to-primary text-background p-2 mb-2">
            <p className="text-center">Associated Lead</p>
            <p className="font-bold">
              {leadBasic.firstName} {leadBasic.lastName}
            </p>
          </div>
        )}
      </SkeletonWrapper>
      <NewLForm leadId={leadBasic?.id} onClose={onNewLeadFormClose} />
    </DrawerRight>
  );
};

type NewLFormProps = {
  leadId: string | undefined;
  onClose: () => void;
};
const NewLForm = ({ leadId, onClose }: NewLFormProps) => {
  const { onLeadInsertMutate, leadInsertIsPending } = useLeadInsertActions();
  const form = useForm<LeadSchemaType>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      homePhone: "",
      gender: Gender.Male,
      maritalStatus: MaritalStatus.Single,
      associatedLead: leadId,
      relationship: "N/A",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="space-6 px-2 w-full"
        onSubmit={form.handleSubmit(onLeadInsertMutate)}
      >
        <div className="flex flex-col gap-2">
          {/* RELATIONSHIP */}
          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem className={leadId ? "" : "opacity-0"}>
                <FormLabel className="flex justify-between items-center">
                  Relationship
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlRelationship"
                  disabled={leadInsertIsPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a RelationShip" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leadRelationShips.map((rel) => (
                      <SelectItem
                        key={rel.relationship}
                        value={rel.relationship}
                      >
                        {rel.relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* FIRSTNAME */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  {" "}
                  First Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John"
                    disabled={leadInsertIsPending}
                    autoComplete="First Name"
                    type="text"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* LASTNAME */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  {" "}
                  Last Name <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Doe"
                    disabled={leadInsertIsPending}
                    autoComplete="Last Name"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* GENDER */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Gender
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlGender"
                  disabled={leadInsertIsPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Gender.Male}>Male</SelectItem>
                    <SelectItem value={Gender.Female}>Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* DATE OF BIRTH */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col pt-2">
                <FormLabel className="flex justify-between items-center">
                  Date of birth
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Dob"
                    disabled={leadInsertIsPending}
                    type="date"
                    autoComplete="DateOfBirth"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* HOMEPHONE */}
          <FormField
            control={form.control}
            name="homePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  {" "}
                  Home Phone
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="457-458-9695"
                    disabled={leadInsertIsPending}
                    autoComplete="phone"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* CELLPHONE */}
          <FormField
            control={form.control}
            name="cellPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Cell Phone
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="555-555-5555"
                    disabled={leadInsertIsPending}
                    autoComplete="phone"
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
                <FormLabel className="flex justify-between items-center">
                  Marital Status
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlMaritalStatus"
                  disabled={leadInsertIsPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Marital status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={MaritalStatus.Single}>Single</SelectItem>
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
              </FormItem>
            )}
          />

          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Email
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="jon.doe@example.com"
                    disabled={leadInsertIsPending}
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
                <FormLabel className="flex justify-between items-center">
                  Address
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123 main street"
                    disabled={leadInsertIsPending}
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
                <FormLabel className="flex justify-between items-center">
                  City
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Queens"
                    disabled={leadInsertIsPending}
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
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  State
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlState"
                  disabled={leadInsertIsPending}
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

          {/* ZIP */}
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Zip Code
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="15468"
                    disabled={leadInsertIsPending}
                    autoComplete="postal-code"
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
          <Button disabled={leadInsertIsPending} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};
