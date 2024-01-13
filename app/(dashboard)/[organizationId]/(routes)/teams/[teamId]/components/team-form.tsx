"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Team } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { Trash } from "lucide-react";
import { Heading } from "@/components/custom/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertModal } from "@/components/modals/alert-modal";

interface TeamFormProps {
  initialData: Team | null;
}

const formSchema = z.object({ name: z.string().min(1) });
type TeamFormValues = z.infer<typeof formSchema>;

export const TeamForm = ({ initialData }: TeamFormProps) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title=initialData?"Edit team":"Create team"
  const description=initialData?"Edit a Team":"Create a new team"
  const toastMessage=initialData?"Team updated.":"Team created."
  const action=initialData?"Save changes":"Create"

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name:""
    },
  });

  const onSubmit = async (values: TeamFormValues) => {
    try {
      setLoading(true);
      if(initialData){

        await axios.patch(`/api/${params.organizationId}/teams/${params.teamId}`, values);
      }
      else{
        await axios.post(`/api/${params.organizationId}/teams`, values);
      }
      router.refresh();
      router.push(`/${params.organizationId}/teams`)
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.organizationId}/teams/${params.teamId}`);
      router.refresh();
      router.push(`/${params.organizationId}/teams`);
      toast.success("Team deleted.");
    } catch (error) {
      toast.error("Make sure you remove all the members first.");
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData &&(
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
          
          )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Team name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
