"use client";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

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
import { ImageModal } from "@/components/modals/image";

type SettingsValues = z.infer<typeof SettingsSchema>;

const SettingsPage = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState(user?.image);
  const [profileOpen, setProfileOpen] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      userName: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onImageUpdated = (e: string[], files: File[]) => {
    setProfileOpen(false);
    setImage(e.at(0) as string);
    update();
    revalidatePath("/");
    router.refresh();

    toast.success("Profile Image has been updated");
  };

  const onSubmit = (values: SettingsValues) => {
    startTransition(() => {
      userUpdateById(values)
        .then((data) => {
          if (data.success) {
            toast.success(data.success);
            update();
          } else toast.error(data.error);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <>
      <ImageModal
        title="Change Profile image?"
        type="user"
        id={user?.id}
        filePath="assets/users"
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onImageUpdate={onImageUpdated}
      />
      <div className="flex mb-2 gap-2 items-center justify-center">
        <div className="relative text-center overflow-hidden rounded-full group">
          <Image
            width={100}
            height={100}
            className="rounded-full shadow-sm shadow-white w-[100px] aspect-square"
            src={image || "/assets/defaults/teamImage.jpg"}
            alt="Team Image"
          />
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
                        {/* <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            disabled={isPending}
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl> */}
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
                        {/* <FormControl>
                          <Input
                            {...field}
                            placeholder="******"
                            disabled={isPending}
                            type="password"
                            autoComplete="new-password"
                          />
                        </FormControl> */}
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
