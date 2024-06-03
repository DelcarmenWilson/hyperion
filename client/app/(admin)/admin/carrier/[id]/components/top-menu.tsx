"use client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Carrier } from "@prisma/client";

type TopMenuProps = {
  carriers: Carrier[];
  carrierId: string;
};

export const TopMenu = ({ carriers, carrierId }: TopMenuProps) => {
  const router = useRouter();
  const setCarrier = (e: string) => {
    if (!e) return;
    router.push(`/admin/carrier/${e}`);
  };
  return (
    <Select
      name="ddlCarriers"
      onValueChange={setCarrier}
      defaultValue={carrierId}
    >
      <SelectTrigger className="ml-auto w-70">
        <SelectValue placeholder="Select a carrier" />
      </SelectTrigger>
      <SelectContent>
        {carriers.map((carrier) => (
          <SelectItem key={carrier.id} value={carrier.id}>
            {carrier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
