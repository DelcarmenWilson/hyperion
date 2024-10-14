"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  usePhoneSetupStore,
  usePhoneSetupActions,
} from "@/hooks/use-phone-setup";

import { PhoneNumber } from "@prisma/client";
import {
  PhoneNumberSchema,
  PhoneNumberSchemaType,
} from "@/schemas/phone-number";

import { Button } from "@/components/ui/button";
import { CardData } from "@/components/reusable/card-data";
import { CustomDialog } from "@/components/global/custom-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import SkeletonWrapper from "@/components/skeleton-wrapper";
import { Switch } from "@/components/ui/switch";
import { TwilioAppSelect } from "@/components/twilio/app-select";
import { UserSelect } from "@/components/user/select";

import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate } from "@/formulas/dates";

export const AssignNumberForm = () => {
  const {
    isPhoneDetailsOpen: isUnassignedFormOpen,
    onPhoneDetailsClose: onUnassignedFormClose,
    phoneNumber,
  } = usePhoneSetupStore();

  if (!phoneNumber) return;
  return (
    <CustomDialog
      open={isUnassignedFormOpen}
      onClose={onUnassignedFormClose}
      title="Phone Number Details"
      description="Unassigend Numbers Form"
    >
      <SkeletonWrapper isLoading={false}>
        <AssignedForm
          phoneNumber={phoneNumber}
          onClose={onUnassignedFormClose}
        />
      </SkeletonWrapper>
    </CustomDialog>
  );
};

type AssignedFormProps = {
  phoneNumber: PhoneNumber;
  onClose: () => void;
};

const AssignedForm = ({ phoneNumber, onClose }: AssignedFormProps) => {
  const { onPhoneNumberUpdate, phoneNumberIsPending } = usePhoneSetupActions();
  const form = useForm<PhoneNumberSchemaType>({
    resolver: zodResolver(PhoneNumberSchema),
    //@ts-ignore
    defaultValues: phoneNumber,
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onClose();
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4 px-2 w-full"
        onSubmit={form.handleSubmit(onPhoneNumberUpdate)}
      >
        <h3 className="font-semibold text-primary text-2xl italic text-center">
          {formatPhoneNumber(phoneNumber.phone)}
        </h3>
        <div className="flex justify-between items-center">
          <CardData label="Sid" value={phoneNumber.sid} />
          {/* REGISTERED */}
          <FormField
            control={form.control}
            name="registered"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between">
                  Registered
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Switch
                    disabled={phoneNumberIsPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <div className="flex gap-2">
            <span>Registered</span>
            <Switch checked={registered} onCheckedChange={setRegistered} />
          </div> */}
        </div>

        {/* APP */}
        <FormField
          control={form.control}
          name="app"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                App
                <FormMessage />
              </FormLabel>
              <FormControl>
                <TwilioAppSelect
                  disabled={phoneNumberIsPending}
                  app={field.value}
                  setApp={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* <h4 className="font-bold">App</h4> */}
        {/* <div className="flex gap-2 text-sm my-2">
          <TwilioAppSelect app={app} setApp={setApp} />
          {app && app != phoneNumber.app && (
            <div className="text-end">
              <Button
                className="w-fit"
                disabled={loading}
                onClick={onNumberUpdateApp}
              >
                Update App
              </Button>
            </div>
          )}
        </div> */}

        <div className="grid grid-cols-3 text-sm">
          <TextGroup label="State" value={phoneNumber.state} />
          <TextGroup
            label="Created At"
            value={formatDate(phoneNumber.createdAt)}
          />
          <TextGroup label="Renew At" value={formatDate(phoneNumber.renewAt)} />
        </div>

        {/* AGENTID */}
        <FormField
          control={form.control}
          name="agentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                Assign/Reassign Number
                <FormMessage />
              </FormLabel>
              <FormControl>
                <UserSelect
                  disabled={phoneNumberIsPending}
                  userId={field.value}
                  setUserId={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* <h4 className="font-bold">Assign/Reassign Number</h4>
        <div className="flex gap-2 text-sm my-2">
          <UserSelect userId={userId} setUserId={setUserId} />
          {userId && userId != phoneNumber.agentId && (
            <div className="text-end">
              <Button
                className="w-fit"
                disabled={loading}
                onClick={onAssignNumber}
              >
                Assign Number
              </Button>
            </div>
          )}
        </div> */}
        <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
          <Button onClick={onCancel} type="button" variant="outlineprimary">
            Cancel
          </Button>
          <Button
            disabled={!form.formState.isDirty || phoneNumberIsPending}
            type="submit"
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

// export const AssignNumberForm = () => {
//   const { isUnassignedFormOpen, onUnassignedFormClose, phoneNumber } =
//     usePhoneSetup();
//   const {
//     userId,
//     setUserId,
//     app,
//     setApp,
//     registered,
//     setRegistered,
//     loading,
//     onAssignNumber,
//     onNumberUpdateApp,
//   } = usePhoneSetupActions(onUnassignedFormClose, phoneNumber);

//   if (!phoneNumber) return;
//   return (
//     <CustomDialog
//       open={isUnassignedFormOpen}
//       onClose={onUnassignedFormClose}
//       title="Phone Number Details"
//       description="Unassigend Numbers Form"
//     >
//       <div className="p-1 space-y-2">
//         <h3 className="font-semibold text-primary text-2xl italic text-center">
//           {formatPhoneNumber(phoneNumber.phone)}
//         </h3>
//         <div className="flex justify-between items-center">
//           <CardData label="Sid" value={phoneNumber.sid} />
//           <div className="flex gap-2">
//             <span>Registered</span>
//             <Switch checked={registered} onCheckedChange={setRegistered} />
//           </div>
//         </div>

//         <h4 className="font-bold">App</h4>
//         <div className="flex gap-2 text-sm my-2">
//           <TwilioAppSelect app={app} setApp={setApp} />
//           {app && app != phoneNumber.app && (
//             <div className="text-end">
//               <Button
//                 className="w-fit"
//                 disabled={loading}
//                 onClick={onNumberUpdateApp}
//               >
//                 Update App
//               </Button>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-3 text-sm">
//           <TextGroup label="State" value={phoneNumber.state} />
//           <TextGroup
//             label="Created At"
//             value={formatDate(phoneNumber.createdAt)}
//           />
//           <TextGroup label="Renew At" value={formatDate(phoneNumber.renewAt)} />
//         </div>
//         <h4 className="font-bold">Assign/Reassign Number</h4>
//         <div className="flex gap-2 text-sm my-2">
//           <UserSelect userId={userId} setUserId={setUserId} />
//           {userId && userId != phoneNumber.agentId && (
//             <div className="text-end">
//               <Button
//                 className="w-fit"
//                 disabled={loading}
//                 onClick={onAssignNumber}
//               >
//                 Assign Number
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </CustomDialog>
//   );
// };

type TextGroupProps = {
  label: string;
  value: string;
};

const TextGroup = ({ label, value }: TextGroupProps) => {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <span>{value}</span>
    </div>
  );
};
