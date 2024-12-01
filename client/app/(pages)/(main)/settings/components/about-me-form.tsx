"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { User } from "@prisma/client";

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
import { Tiptap } from "@/components/reusable/tiptap";

import { updateUserAboutMe } from "@/actions/user";
import { UserAboutMeSchemaType, UserAboutMeSchema } from "@/schemas/user";
export const AboutMeForm = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserAboutMeSchemaType>({
    resolver: zodResolver(UserAboutMeSchema),
    //@ts-ignore
    defaultValues: user,
  });

  const onSubmit = (values: UserAboutMeSchemaType) => {
    startTransition(() => {
      updateUserAboutMe(values)
        .then((data) => {
          toast.success(data);
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6 px-1" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 ">
          <div className="space-y-1">
            {/* TITLE */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Job Title"
                      disabled={isPending}
                      autoComplete="title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ABOUT ME */}
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> About Me</FormLabel>
                  <FormControl>
                    <Tiptap
                      description={field.value as string}
                      maxHeight="h-[300px]"
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </div>
          <div></div>
        </div>
      </form>
    </Form>
  );
};
