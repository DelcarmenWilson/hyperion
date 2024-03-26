"use client";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMasterAccountModal } from "@/hooks/use-master-account-modal";
import { Modal } from "@/components/modals/modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { MasterRegisterSchema } from "@/schemas";
import { userMasterInsert } from "@/actions/user";

export const MasterAccountModal = () => {
  const masterModel = useMasterAccountModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof MasterRegisterSchema>>({
    resolver: zodResolver(MasterRegisterSchema),
    defaultValues: {
      organization: "",
      team: "",
      userName: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof MasterRegisterSchema>) => {
    setLoading(true);
    await userMasterInsert(values).then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        window.location.assign(`/admin`);
        toast.success(data.success);
      }
    });
    setLoading(false);
  };
  return (
    <Modal
      title="Create a master account"
      description="Create a master account to handle all users"
      isOpen={masterModel.isOpen}
      onClose={masterModel.onClose}
    >
      <Form {...form}>
        <form
          className="flex flex-col flex-1 overflow-hidden"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ScrollArea className="pr-2">
            <div className="p-2">
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Family First Life"
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="Strong Side"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="John doe"
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
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
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
                          disabled={loading}
                          {...field}
                          placeholder="doe"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </ScrollArea>
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              disabled={loading}
              variant="outline"
              onClick={masterModel.onClose}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
      {/* </div> */}
    </Modal>
  );
};
