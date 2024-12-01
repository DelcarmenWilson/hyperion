"use client";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/user/use-current";

import { toast } from "sonner";
import { UserRole } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";
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
import { Button } from "@/components/ui/button";

import { SettingsSchema, SettingsSchemaType } from "@/schemas/settings";
import { updateUser } from "@/actions/user";

export const ProfileForm = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      userName: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || "USER",
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: SettingsSchemaType) => {
    startTransition(() => {
      updateUser(values)
        .then((data) => {
          toast.success(data);
          update();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 px-1" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <div>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> User Name</FormLabel>
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
                      <FormLabel> Current Password</FormLabel>
                      <FormControl className="relative">
                        <div className="w-full flex items-center">
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="******"
                            type={showCurrentPassword ? "text" : "password"}
                            autoComplete="new-password"
                          />

                          <Button
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            size="sm"
                            variant="ghost"
                            type="button"
                            className="absolute right-0"
                            tabIndex={-1}
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                        </div>
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
                      <FormControl className="relative">
                        <div className="w-full flex items-center">
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="******"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                          />

                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            size="sm"
                            variant="ghost"
                            type="button"
                            className="absolute right-0"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                        </div>
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
                      <SelectItem value={UserRole.SUPER_ADMIN}>
                        Super Admin
                      </SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={UserRole.USER}>User</SelectItem>
                      <SelectItem value={UserRole.ASSISTANT}>
                        Assistant
                      </SelectItem>
                      <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
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
  );
};
