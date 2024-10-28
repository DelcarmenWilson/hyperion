"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useOrganizationActions } from "../hooks/use-organization";

import {
  SuperAdminRegisterSchema,
  SuperAdminRegisterSchemaType,
} from "@/schemas/register";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DrawerRight } from "@/components/custom/drawer/right";

type Props = { enabled?: boolean };
export const OrganizationForm = ({ enabled = false }: Props) => {
  const { isFormOpen, setFormOpen } = useOrganizationActions();
  return (
    <>
      {enabled && (
        <Button size="sm" onClick={() => setFormOpen(true)}>
          New Organization
        </Button>
      )}
      <DrawerRight
        title={"New Organization"}
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
      >
        <OrgForm onClose={() => setFormOpen(false)} />
      </DrawerRight>
    </>
  );
};

type OrgFormProps = {
  onClose: () => void;
};

export const OrgForm = ({ onClose }: OrgFormProps) => {
  const { onOrganizationInsert, organizationsIsPending } =
    useOrganizationActions();
  const [show, setShow] = useState(false);

  const form = useForm<SuperAdminRegisterSchemaType>({
    resolver: zodResolver(SuperAdminRegisterSchema),
    defaultValues: {
      password: "admin773",
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
        onSubmit={form.handleSubmit(onOrganizationInsert)}
        className="flex flex-col flex-1 h-full overflow-hidden p-2 gap-2"
      >
        {/* ORGANIZATION NAME */}
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Organization Name
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtOrganizationName"
                  disabled={organizationsIsPending}
                  {...field}
                  placeholder="e.g. Sample Organization"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* TEAM */}
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Team Name
                <FormMessage />
              </FormLabel>
              <FormControl>
                <Input
                  id="txtTeamName"
                  disabled={organizationsIsPending}
                  {...field}
                  placeholder="e.g. Sample Team"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
                    disabled={organizationsIsPending}
                    {...field}
                    placeholder="e.g. 525634"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div />

          {/* USER INFO */}

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
                    disabled={organizationsIsPending}
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
                    disabled={organizationsIsPending}
                    {...field}
                    placeholder="doe"
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
                  disabled={organizationsIsPending}
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
                  disabled={organizationsIsPending}
                  {...field}
                  placeholder="e.g. john.doe@example.com"
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
                    disabled={organizationsIsPending}
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
          <Button disabled={organizationsIsPending} type="submit">
            Add Organization
          </Button>
        </div>
      </form>
    </Form>
  );
};
