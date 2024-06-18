import { useState } from "react";
import { userEmitter } from "@/lib/event-emmiter";
import { handleFileUpload } from "@/lib/utils";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";

import { UserLicenseSchema, UserLicenseSchemaType } from "@/schemas/user";

import { UserLicense } from "@prisma/client";
import ReactDatePicker from "react-datepicker";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/custom/image-upload";
import { userLicenseInsert, userLicenseUpdateById } from "@/actions/user";
import { states } from "@/constants/states";

type LicenseFormProps = {
  license?: UserLicense;
  onClose: () => void;
};

export const LicenseForm = ({ license, onClose }: LicenseFormProps) => {
  const [loading, setLoading] = useState(false);
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
  const onSubmit = async (values: UserLicenseSchemaType) => {
    setLoading(true);
    if (file.image) {
      values.image = await handleFileUpload({
        newFile: file.image,
        filePath: "user-licenses",
        oldFile: license?.image,
      });
    }
    if (license) {
      const updatedLicense = await userLicenseUpdateById(values);
      if (updatedLicense.success) {
        userEmitter.emit("licenseUpdated", updatedLicense.success);
        toast.success("License updated!");
        onCancel();
      } else toast.error(updatedLicense.error);
    } else {
      const InsertedLicense = await userLicenseInsert(values);
      if (InsertedLicense.success) {
        userEmitter.emit("licenseInserted", InsertedLicense.success);
        toast.success("License created!");
        onCancel();
      } else toast.error(InsertedLicense.error);
    }
    setLoading(false);
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="space-6 px-2 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ImageUpload
            selectedImage={form.getValues("image") as string}
            onImageUpdate={onImageUpdate}
            onImageRemove={onImageRemove}
          />
          <div className="flex flex-col gap-2">
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
          <div className="grid grid-cols-2 gap-x-2 justify-between my-2">
            <Button onClick={onCancel} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {btnText}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
