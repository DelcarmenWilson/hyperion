import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAgentLicenseActions } from "../../hooks/use-license";

import { UserLicense } from "@prisma/client";
import { UserLicenseSchema, UserLicenseSchemaType } from "@/schemas/user";

import { Button } from "@/components/ui/button";
import { DrawerRight } from "@/components/custom/drawer/right";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/custom/image-upload";
import { Input } from "@/components/ui/input";
import ReactDatePicker from "react-datepicker";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { states } from "@/constants/states";

type LicenseFormProps = {
  license?: UserLicense;
  open: boolean;
  onClose: () => void;
};
const LicenseDrawer = ({ license, open, onClose }: LicenseFormProps) => {
  const title = license ? "Edit License" : "New License";
  const { onCreateLicense, licenseCreating, onUpdateLicense, licenseUpdating } =
    useAgentLicenseActions(onClose);
  return (
    <DrawerRight title={title} isOpen={open} onClose={onClose} scroll={false}>
      <LicenseForm
        license={license}
        loading={license ? licenseUpdating : licenseCreating}
        onSubmit={license ? onUpdateLicense : onCreateLicense}
        onClose={onClose}
      />
    </DrawerRight>
  );
};

type Props = {
  license?: UserLicense;
  loading: boolean;
  onSubmit: (e: UserLicenseSchemaType) => void;
  onClose: () => void;
};

const LicenseForm = ({ license, loading, onSubmit, onClose }: Props) => {
  const [file, setFile] = useState<{
    image: File | null;
    url: string | null;
  }>({ image: null, url: null });

  const btnText = license ? "Update" : "Create";

  const form = useForm<UserLicenseSchemaType>({
    resolver: zodResolver(UserLicenseSchema),
    //@ts-ignore
    defaultValues: license || {
      state: "",
      type: "",
      licenseNumber: "",
      dateExpires: "",
    },
  });

  const onCancel = () => {
    form.clearErrors();
    form.reset();
    onImageRemove();
    onClose();
  };
  const onImageUpdate = (image: File, url: string) => {
    setFile({ image, url });
    form.setValue("image", url);
  };
  const onImageRemove = () => {
    setFile({ image: null, url: null });
    form.setValue("image", undefined);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col overflow-hidden w-full h-full px-1"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ImageUpload
          selectedImage={form.getValues("image") as string}
          onImageUpdate={onImageUpdate}
          onImageRemove={onImageRemove}
        />
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-3">
            {/* STATE */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    State
                    <FormMessage />
                  </FormLabel>
                  <Select
                    name="ddlState"
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    autoComplete="address-level1"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.abv} value={state.abv}>
                          {state.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Type
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Life/accident/health"
                      disabled={loading}
                      autoComplete="Type"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* LICENSE NUMBER*/}
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Number
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="124548"
                      disabled={loading}
                      type="text"
                      autoComplete="licenseNumber"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* DATE EXPIRES */}
            <FormField
              control={form.control}
              name="dateExpires"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel className="flex justify-between items-center">
                    Expiration Date
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    {/* <Input
                      {...field}
                      placeholder="12/05/2025"
                      disabled={loading}
                      type="date"
                      autoComplete="expiraionDate"
                    /> */}
                    <ReactDatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="MM-d-yyyy"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholderText="12/05/2025"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* TYPE */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex justify-between items-center">
                    Comments
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Leave some comments"
                      disabled={loading}
                      autoComplete="Type"
                      rows={5}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="mt-auto grid grid-cols-2 gap-x-2">
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {btnText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LicenseDrawer;
