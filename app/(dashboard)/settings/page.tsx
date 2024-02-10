"use client";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { User } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";

import { SettingsSchema } from "@/schemas";
import { userUpdateById } from "@/actions/user";
import { ProfileImageModal } from "@/components/modals/profile-image-modal";

type SettingsValues = z.infer<typeof SettingsSchema>;

const SettingsPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState(user?.image);
  const [profileOpen, setProfileOpen] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onImageUpdated = () => {
    setProfileOpen(false);
    update();
    router.push("/settings");
  };

  const onSubmit = (values: SettingsValues) => {
    startTransition(() => {
      userUpdateById(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            update();
          }
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <>
      <ProfileImageModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onImageUpdate={onImageUpdated}
      />
      <div className="flex mb-2 gap-2 items-center justify-center">
        <div className="relative text-center overflow-hidden rounded-full group">
          <Avatar className="w-[100px] h-auto rounded-full">
            <AvatarImage src={image || ""} />
            <AvatarFallback className="bg-primary dark:bg-accent">
              <User className="text-accent dark:text-primary h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <Button
            className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100"
            variant="secondary"
            onClick={() => setProfileOpen(true)}
          >
            CHANGE
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form className="space-y-6 px-1" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> user Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!user?.isOAuth && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="johndoe@example.com"
                            disabled={isPending}
                            type="email"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            disabled={isPending}
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            disabled={isPending}
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
            <div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Role</FormLabel>
                    <Select
                      name="ddlUserRole"
                      disabled
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={UserRole.MASTER}>Master</SelectItem>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!user?.isOAuth && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor Authentication for you account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          name="cblIsTwoFactor"
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SettingsPage;
