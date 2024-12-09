import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadStore } from "@/hooks/lead/use-lead";
import { useLeadIntakePersonalActions } from "@/hooks/lead/use-intake";

import ReactDatePicker from "react-datepicker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  IntakeEmploymentSchema,
  IntakeEmploymentSchemaType,
  IntakeGeneralSchema,
  IntakeGeneralSchemaType,
  IntakeMiscSchema,
  IntakeMiscSchemaType,
  IntakePersonalSchema,
  IntakePersonalSchemaType,
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

type Props = {
  info: IntakePersonalSchemaType;
};
type FormProps = {
  info: IntakePersonalSchemaType;
  onClose: () => void;
};
export const PersonalMainInfoForm = ({ info }: Props) => {
  const { onIntakeDialogClose } = useLeadStore();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
        {/* GENERAL */}
        <TabsContent
          className="flex-1 w-full data-[state=active]:h-full overflow-hidden overflow-y-auto p-1"
          value="general"
        >
          <GeneralForm info={info} onClose={onIntakeDialogClose} />
        </TabsContent>
        {/* PERSONAL */}
        <TabsContent
          className="flex-1 w-full data-[state=active]:h-full overflow-hidden overflow-y-auto"
          value="personal"
        >
          <PersonalForm info={info} onClose={onIntakeDialogClose} />
        </TabsContent>
        {/* EMPLOYEMENT */}
        <TabsContent
          className="flex-1 w-full data-[state=active]:h-full overflow-hidden overflow-y-auto"
          value="employment"
        >
          <EmploymentForm info={info} onClose={onIntakeDialogClose} />
        </TabsContent>
        {/* MISC */}
        <TabsContent
          className="flex-1 w-full data-[state=active]:h-full overflow-hidden overflow-y-auto"
          value="misc"
        >
          <MiscForm info={info} onClose={onIntakeDialogClose} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GeneralForm = ({ info, onClose }: FormProps) => {
  const { generalIsPending, onGeneralSubmit } = useLeadIntakePersonalActions();

  const form = useForm<IntakeGeneralSchemaType>({
    resolver: zodResolver(IntakeGeneralSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
        onSubmit={form.handleSubmit(onGeneralSubmit)}
      >
        {/* GENERAL */}
        <div className="grid grid-cols-2 gap-x-2 justify-between mx-1">
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
                    disabled={generalIsPending}
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
                    disabled={generalIsPending}
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
                  disabled={generalIsPending}
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
                  disabled={generalIsPending}
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
                  disabled={generalIsPending}
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
                  disabled={generalIsPending}
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
                    disabled={generalIsPending}
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
                  {/* <Input
                    {...field}
                    placeholder="Dob"
                    disabled={generalIsPending}
                    type="date"
                    autoComplete="DateOfBirth"
                  /> */}
                  <ReactDatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="MM-dd-yy"
                    className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                    disabled={generalIsPending}
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
                  disabled={generalIsPending}
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
                    disabled={generalIsPending}
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
                  disabled={generalIsPending}
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

        <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={generalIsPending} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

const PersonalForm = ({ info, onClose }: FormProps) => {
  const { personalIsPending, onPersonalSubmit } =
    useLeadIntakePersonalActions();

  const form = useForm<IntakePersonalSchemaType>({
    resolver: zodResolver(IntakePersonalSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
        onSubmit={form.handleSubmit(onPersonalSubmit)}
      >
        {/* PERSONAL */}
        <div className="grid grid-cols-2 gap-x-2 justify-between mx-1 mb-1">
          {/* SSN */}
          <FormField
            control={form.control}
            name="ssn"
            render={({ field }) => (
              <FormItem className="relative flex gap-2 justify-between items-center col-span-2 mb-1">
                <FormLabel>SSN#</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="eg. 555-55-5555"
                    disabled={personalIsPending}
                    autoComplete="off"
                    maxLength={9}
                  />

                  {/* <InputOTP maxLength={9} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                            <InputOTPSlot index={8} />
                          </InputOTPGroup>*/}

                  {/* <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSeparator />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                            <InputOTPSlot index={8} />
                          </InputOTPGroup> */}
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
                    disabled={personalIsPending}
                    autoComplete="off"
                    maxLength={12}
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
                  disabled={personalIsPending}
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
        <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={personalIsPending} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

const EmploymentForm = ({ info, onClose }: FormProps) => {
  const { employmentIsPending, onEmploymentSubmit } =
    useLeadIntakePersonalActions();
  const form = useForm<IntakeEmploymentSchemaType>({
    resolver: zodResolver(IntakeEmploymentSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
        onSubmit={form.handleSubmit(onEmploymentSubmit)}
      >
        {/* EMPLOYEMENT */}

        <div className="grid grid-cols-2 gap-x-2 justify-between mx-1 mb-1">
          <div className="space-y-1">
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
                      disabled={employmentIsPending}
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
                      disabled={employmentIsPending}
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
                      disabled={employmentIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-1">
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
                      disabled={employmentIsPending}
                      autoComplete="off"
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
                      disabled={employmentIsPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={employmentIsPending}
                      autoComplete="off"
                      type="number"
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
                      disabled={employmentIsPending}
                      autoComplete="off"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={employmentIsPending} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

const MiscForm = ({ info, onClose }: FormProps) => {
  const { miscIsPending, onMiscSubmit } = useLeadIntakePersonalActions();

  const form = useForm<IntakeMiscSchemaType>({
    resolver: zodResolver(IntakeMiscSchema),
    defaultValues: info,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-2 px-2 w-full h-full overflow-hidden"
        onSubmit={form.handleSubmit(onMiscSubmit)}
      >
        <div className="grid grid-cols-2 gap-x-2 justify-between mx-1 mb-1">
          <div className="space-y-1">
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
                      disabled={miscIsPending}
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
                        <SelectItem value="Citizen">US Citizen</SelectItem>
                        <SelectItem value="Non-Citizen">Non-Citizen</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues("citizenShip") == "Non-Citizen" && (
              <>
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
                          disabled={miscIsPending}
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
                      <FormLabel>Years In USA</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30"
                          disabled={miscIsPending}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <div className="space-y-1">
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
                      disabled={miscIsPending}
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
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CUASE OF DEATH */}
            {form.getValues("parentLiving") == "No" ? (
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
                        disabled={miscIsPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <>
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
                          disabled={miscIsPending}
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
                          disabled={miscIsPending}
                          autoComplete="off"
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button disabled={miscIsPending} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
