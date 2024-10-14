import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useBeneficiaryStore,
  useLeadBeneficiaryActions,
  useLeadBeneficiaryData,
} from "@/hooks/lead/use-beneficiary";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { states } from "@/constants/states";
import { Textarea } from "@/components/ui/textarea";

import { Gender } from "@prisma/client";
import {
  LeadBeneficiarySchema,
  LeadBeneficiarySchemaType,
} from "@/schemas/lead";
import { LeadBeneficiary } from "@prisma/client";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { DrawerRight } from "@/components/custom/drawer-right";
import { leadRelationShips } from "@/constants/lead";

export const BeneficiaryForm = () => {
  const { leadId, beneficiary, isFetchingBeneficiary } =
    useLeadBeneficiaryData();
  const { isBeneficiaryFormOpen, onBeneficiaryFormClose } =
    useBeneficiaryStore();

  return (
    <DrawerRight
      title="New Beneficiary"
      isOpen={isBeneficiaryFormOpen}
      onClose={onBeneficiaryFormClose}
    >
      <SkeletonWrapper isLoading={isFetchingBeneficiary}>
        <BeneForm
          leadId={leadId}
          beneficiary={beneficiary}
          onClose={onBeneficiaryFormClose}
        />
      </SkeletonWrapper>
    </DrawerRight>
  );
};

type BeneFormProps = {
  leadId?: string;
  beneficiary?: LeadBeneficiary | null;
  onClose: () => void;
};
const BeneForm = ({ leadId, beneficiary, onClose }: BeneFormProps) => {
  const { onBeneficiarySubmit, isBeneficiaryPending } =
    useLeadBeneficiaryActions();

  const btnTitle = beneficiary ? "Update" : "Create";

  const form = useForm<LeadBeneficiarySchemaType>({
    resolver: zodResolver(LeadBeneficiarySchema),
    defaultValues: beneficiary || {
      leadId: leadId,
      type: "Primary",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onBeneficiarySubmit)}
        >
          <div>
            <div className="flex flex-col gap-2">
              {/* TYPE */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Type
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlType"
                      disabled={isBeneficiaryPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Contingent">Contingent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {/* RELATIONSHIP */}
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between items-center">
                      Relationship
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlRelationship"
                      disabled={isBeneficiaryPending}
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
              {/* SHARE */}
              <FormField
                control={form.control}
                name="share"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Share
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="50%"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
                        type="text"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* FIRSTNAME */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      First Name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      Last Name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      Gender
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlGender"
                      disabled={isBeneficiaryPending}
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
                    <FormLabel className="flex items-center justify-between">
                      Date of birth
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Dob"
                        disabled={isBeneficiaryPending}
                        type="date"
                        autoComplete="DateOfBirth"
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
                    <FormLabel className="flex items-center justify-between">
                      Cell Phone
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="555-555-5555"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      Email
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="jon.doe@example.com"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
                        type="email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* SSN */}
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Ssn #
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="565856985"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
                        type="text"
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
                    <FormLabel className="flex items-center justify-between">
                      Address
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123 main street"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      City
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Queens"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      State
                      <FormMessage />
                    </FormLabel>
                    <Select
                      name="ddlState"
                      disabled={isBeneficiaryPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      autoComplete="off"
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
                    <FormLabel className="flex items-center justify-between">
                      Zip Code
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="15468"
                        disabled={isBeneficiaryPending}
                        autoComplete="postal-code"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Notes
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="notes"
                        disabled={isBeneficiaryPending}
                        autoComplete="off"
                        rows={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isBeneficiaryPending} type="submit">
              {btnTitle}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
