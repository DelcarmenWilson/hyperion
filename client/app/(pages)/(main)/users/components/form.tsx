"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useCurrentUser } from "@/hooks/user/use-current";
import { useUserActions, useUserData } from "@/hooks/user/use-user";

import { RegisterSchema, RegisterSchemaType } from "@/schemas/register";

import { Button } from "@/components/ui/button";
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

type Props = {
  onClose: () => void;
};

export const AssistantForm = ({ onClose }: Props) => {
  const { admins, teams } = useUserData();
  const { onAssistantInsert, assistantIsPending } = useUserActions();
  const user = useCurrentUser();

  const [show, setShow] = useState(false);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      id: undefined,
      team: user?.team,
      npn: "123456",
      password: "user773",
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
        onSubmit={form.handleSubmit(onAssistantInsert)}
        className="flex flex-col flex-1 gap-2 p-2 h-full overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* TEAM */}
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Team
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlTeam"
                  disabled={assistantIsPending}
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
                    {teams?.map((team) => (
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
                <FormLabel className="flex justify-between items-center">
                  Agent
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlAgent"
                  disabled={assistantIsPending}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  autoComplete="agent"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {admins?.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {/* FIRST NAME */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  First Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    id="txtFirstName"
                    disabled={assistantIsPending}
                    {...field}
                    placeholder="John"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* LAST NAME */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Last Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    id="txtLastName"
                    disabled={assistantIsPending}
                    {...field}
                    placeholder="Doe"
                  />
                </FormControl>
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
              <FormLabel className="flex justify-between items-center">
                Username
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtUsername"
                  disabled={assistantIsPending}
                  {...field}
                  placeholder="j.doe"
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
              <FormLabel className="flex justify-between items-center">
                Email
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtEmail"
                  disabled={assistantIsPending}
                  {...field}
                  placeholder="john.doe@example.com"
                  type="email"
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Password
                <FormMessage />
              </FormLabel>
              <FormControl className="relative">
                <div className="w-full flex items-center">
                  <Input
                    id="txtPassword"
                    disabled={assistantIsPending}
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
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-x-2 justify-between mt-auto">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={assistantIsPending} type="submit">
            Add Assistant
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const UserForm = ({ onClose }: Props) => {
  const { teams } = useUserData();
  const { onUserInsert, userIsPending } = useUserActions();
  const user = useCurrentUser();

  const [show, setShow] = useState(false);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      id: undefined,
      team: user?.team,
      npn: "123456",
      password: "user773",
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
        onSubmit={form.handleSubmit(onUserInsert)}
        className="flex flex-col flex-1 gap-2 p-2 h-full overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* TEAM */}
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Team
                  <FormMessage />
                </FormLabel>
                <Select
                  name="ddlTeam"
                  disabled={userIsPending}
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
                    {teams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {/* NPN */}
          <FormField
            control={form.control}
            name="npn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Npn#
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    id="txtNpn"
                    disabled={userIsPending}
                    {...field}
                    placeholder="e.g. 525634"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* FIRST NAME */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  First Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    id="txtFirstName"
                    disabled={userIsPending}
                    {...field}
                    placeholder="John"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* LAST NAME */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  Last Name
                  <FormMessage />
                </FormLabel>
                <FormControl>
                  <Input
                    id="txtLastName"
                    disabled={userIsPending}
                    {...field}
                    placeholder="Doe"
                  />
                </FormControl>
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
              <FormLabel className="flex justify-between items-center">
                Username
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtUsername"
                  disabled={userIsPending}
                  {...field}
                  placeholder="j.doe"
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
              <FormLabel className="flex justify-between items-center">
                Email
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtEmail"
                  disabled={userIsPending}
                  {...field}
                  placeholder="john.doe@example.com"
                  type="email"
                  autoComplete="off"
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* PASSWORD */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Password
                <FormMessage />
              </FormLabel>
              <FormControl className="relative">
                <div className="w-full flex items-center">
                  <Input
                    id="txtPassword"
                    disabled={userIsPending}
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
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-x-2 justify-between mt-auto">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={userIsPending} type="submit">
            Add User
          </Button>
        </div>
      </form>
    </Form>
  );
};