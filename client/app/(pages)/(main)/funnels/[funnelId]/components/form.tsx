"use client";
import React, { useEffect } from "react";
import { CopyPlusIcon, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 } from "uuid";

import { FunnelPage } from "@prisma/client";
import { FunnelPageSchema, FunnelPageSchemaType } from "@/schemas/funnel";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Loading from "@/components/global/loading";

import { funnelsGetAll } from "@/actions/funnel/index";
import {
  funnelPageDeleteById,
  funnelPageUpsertById,
} from "@/actions/funnel/page";

interface FunnelPageFormProps {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
}

const FunnelPageForm: React.FC<FunnelPageFormProps> = ({
  defaultData,
  funnelId,
  order,
}) => {
  const router = useRouter();
  //ch
  const form = useForm<FunnelPageSchemaType>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData]);

  const onSubmit = async (values: FunnelPageSchemaType) => {
    if (order !== 0 && !values.pathName)
      return form.setError("pathName", {
        message:
          "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    try {
      const response = await funnelPageUpsertById(
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId
      );

      //   await saveActivityLogsNotification({
      //     agencyId: undefined,
      //     description: `Updated a funnel page | ${response?.name}`,
      //     subaccountId: subaccountId,
      //   })

      toast.success("Saves Funnel Page Details");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Could Not Save Funnel Page Details");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You
          can move them around to change their order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting || order === 0}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Path for the page"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                className="w-22 self-end"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Page"}
              </Button>

              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const response = await funnelPageDeleteById(defaultData.id);
                    // await saveActivityLogsNotification({
                    //   agencyId: undefined,
                    //   description: `Deleted a funnel page | ${response?.name}`,
                    //   subaccountId: subaccountId,
                    // });
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <Trash />}
                </Button>
              )}
              {defaultData?.id && (
                <Button
                  variant={"outline"}
                  size={"icon"}
                  disabled={form.formState.isSubmitting}
                  type="button"
                  onClick={async () => {
                    const response = await funnelsGetAll();
                    const lastFunnelPage = response.find(
                      (funnel) => funnel.id === funnelId
                    )?.funnelPages.length;

                    await funnelPageUpsertById(
                      {
                        ...defaultData,
                        id: v4(),
                        order: lastFunnelPage ? lastFunnelPage : 0,
                        visits: 0,
                        name: `${defaultData.name} Copy`,
                        pathName: `${defaultData.pathName}copy`,
                        content: defaultData.content,
                      },
                      funnelId
                    );
                    toast.success("Saved Funnel Page Details");
                    router.refresh();
                  }}
                >
                  {form.formState.isSubmitting ? <Loading /> : <CopyPlusIcon />}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelPageForm;
