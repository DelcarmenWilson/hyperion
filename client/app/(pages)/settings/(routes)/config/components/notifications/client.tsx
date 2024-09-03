"use client";
import { NotificationForm } from "./form";
import { useNotificationData } from "../../hooks/use-config";
import SkeletonWrapper from "@/components/skeleton-wrapper";

// export const NotificationClient = ({
//   notificationSettings,
// }: {
//   notificationSettings: NotificationSettings;
// }) => {
//   const { update } = useSession();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<NotificationSettingsSchemaType>({
//     resolver: zodResolver(NotificationSettingsSchema),
//     defaultValues: notificationSettings,
//   });

//   const onSubmit = (values: NotificationSettingsSchemaType) => {
//     startTransition(() => {
//       notificationSettingsUpdateByUserId(values)
//         .then((data) => {
//           if (data.success) {
//             toast.success(data.success);
//             update();
//           } else toast.error(data.error);
//         })
//         .catch(() => {
//           toast.error("Something went wrong");
//         });
//     });
//   };

//   return (
//     <>
//       <Heading
//         title={"Notifications"}
//         description="Manage all your Notifications"
//       />
//       <Form {...form}>
//         <form className="px-1" onSubmit={form.handleSubmit(onSubmit)}>
//           <FormField
//             control={form.control}
//             name="phoneNumber"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel> Personal Number</FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     className="w-[50%]"
//                     placeholder="3454575869"
//                     disabled={isPending}
//                     autoComplete="phoneNumber"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
//             <div>
//               <FormField
//                 control={form.control}
//                 name="calls"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
//                     <div className="space-y-0.5">
//                       <FormLabel>Calls</FormLabel>
//                       <FormDescription>
//                         Enable notifications for calls
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         name="cbCalls"
//                         disabled={isPending}
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               {/* APPOINTMENTS */}
//               <FormField
//                 control={form.control}
//                 name="appointments"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
//                     <div className="space-y-0.5">
//                       <FormLabel>Appointments</FormLabel>
//                       <FormDescription>
//                         Enable notifications for appointments
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         name="cblAppointments"
//                         disabled={isPending}
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               {/* TEXT FORWARDING */}
//               <FormField
//                 control={form.control}
//                 name="textForward"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
//                     <div className="space-y-0.5">
//                       <FormLabel>Text Forward</FormLabel>
//                       <FormDescription>
//                         Enable text forwading to your personal number
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         name="cbTextFoward"
//                         disabled={isPending}
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div>
//               <FormField
//                 control={form.control}
//                 name="messages"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
//                     <div className="space-y-0.5">
//                       <FormLabel>Messages</FormLabel>
//                       <FormDescription>
//                         Enable notifications for messages
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         name="cbMessages"
//                         disabled={isPending}
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="voicemails"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
//                     <div className="space-y-0.5">
//                       <FormLabel>Voicemails</FormLabel>
//                       <FormDescription>
//                         Enable notifications for voicemails
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch
//                         name="cbVoicemails"
//                         disabled={isPending}
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <div className="flex justify-end mt-2">
//                 <Button disabled={isPending} type="submit">
//                   Save
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </form>
//       </Form>
//     </>
//   );
// };

export const NotificationClient = () => {
  const {
    settings,
    isFetchingSettings,
    loading,
    onNotificationSettingsSubmit,
  } = useNotificationData();

  return (
    <SkeletonWrapper isLoading={isFetchingSettings}>
      <NotificationForm
        notificationSettings={settings!}
        loading={loading}
        onSubmit={onNotificationSettingsSubmit}
      />
    </SkeletonWrapper>
  );
};
