"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RegisterSchema, RegisterSchemaType } from "@/schemas/register";
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

import { Team, User } from "@prisma/client";
import { userInsertAssistant } from "@/actions/user";

type AssistantFormProps = {
  admins: User[];
  teams: Team[];
  onClose?: (e?: User) => void;
};

export const AssistantForm = ({
  admins,
  teams,
  onClose,
}: AssistantFormProps) => {
  const user = useCurrentUser();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      id: user?.id,
      team: user?.team,
      npn: "123456",
      userName: "",
      password: "user773",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (values: RegisterSchemaType) => {
    startTransition(async () => {
      const insertedAssistant = await userInsertAssistant(values);
      if (insertedAssistant.success) {
        form.reset();
        if (onClose) onClose();
        router.refresh();
        toast.success(insertedAssistant.success);
      } else toast.error(insertedAssistant.error);
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="p-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* TEAM */}
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Team
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlTeam"
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="team"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* AGENT */}
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between">
                    Agent
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlAgent"
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="agent"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Team" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {admins.map((admin) => (
                        <SelectItem key={admin.id} value={admin.id}>
                          {admin.userName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      id="txtFirstName"
                      disabled={isPending}
                      {...field}
                      placeholder="John"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      id="txtLastName"
                      disabled={isPending}
                      {...field}
                      placeholder="doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* USERNAME */}
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    id="txtUsername"
                    disabled={isPending}
                    {...field}
                    placeholder="j.doe"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* EMAIL */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="txtEmail"
                    disabled={isPending}
                    {...field}
                    placeholder="john.doe@example.com"
                    type="email"
                    autoComplete="off"
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
                <FormLabel>Password</FormLabel>
                <FormControl className="relative">
                  <div className="w-full flex items-center">
                    <Input
                      id="txtPassword"
                      disabled={isPending}
                      {...field}
                      placeholder="******"
                      type={show ? "text" : "password"}
                      autoComplete="new-password"
                    />

                    <Button
                      onClick={() => setShow(!show)}
                      size="sm"
                      variant="ghost"
                      type="button"
                      className="absolute right-0"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </FormControl>
                {/* <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="******"
                    type="password"
                  />
                </FormControl> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              Add Asistant
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
