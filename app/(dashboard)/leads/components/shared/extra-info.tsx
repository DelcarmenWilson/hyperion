"use client";
import { useState } from "react";
import { format } from "date-fns";

import { allVendors } from "@/constants/vendors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  leadUpdateByIdCommision,
  leadUpdateByIdCost,
  leadUpdateByIdSale,
  leadUpdateByIdVendor,
} from "@/actions/lead";

import { toast } from "sonner";
import { FullLead } from "@/types";
import { FieldBox } from "./field-box";

interface ExtraInfoProps {
  lead: FullLead;
}

export const ExtraInfo = ({ lead }: ExtraInfoProps) => {
  const [converageAmount, setCoverageAmount] = useState(
    lead.saleAmount?.toString() || ""
  );
  const [annualPremium, setAp] = useState(lead.commision?.toString() || "");
  const [costOfLead, setCostOfLead] = useState(
    lead.costOfLead?.toString() || ""
  );

  const onConverageUpdated = () => {
    const newSale = parseInt(converageAmount);
    if (newSale != lead.saleAmount) {
      lead.saleAmount = newSale;
      leadUpdateByIdSale(lead.id, newSale).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    }
  };

  const onApUpdated = () => {
    const newCommision = parseInt(annualPremium);
    if (newCommision != lead.commision) {
      lead.commision = newCommision;
      leadUpdateByIdCommision(lead.id, newCommision).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    }
  };

  const onCostUpdated = () => {
    const newCost = parseInt(costOfLead);
    if (newCost != lead.costOfLead) {
      lead.costOfLead = newCost;
      leadUpdateByIdCost(lead.id, newCost).then((data) => {
        if (data.error) {
          toast.error(data.error);
        }
        if (data.success) {
          toast.success(data.success);
        }
      });
    }
  };

  const onVendorUpdated = (name: string) => {
    leadUpdateByIdVendor(lead.id, name).then((data) => {
      if (data.error) {
        toast.success(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div>
        <p>Recieved on</p>
        <p>{format(lead.createdAt, "MM-dd-yy h:mm aaaa")}</p>
      </div>
      <Select
        name="ddlVendor"
        defaultValue={lead.vendor}
        onValueChange={onVendorUpdated}
      >
        <SelectTrigger>
          <SelectValue placeholder="Vendor" />
        </SelectTrigger>
        <SelectContent>
          {allVendors.map((vendor) => (
            <SelectItem key={vendor.name} value={vendor.value}>
              {vendor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldBox
        name="Coverage amount"
        field={converageAmount}
        maxLength={9}
        setField={setCoverageAmount}
        onFieldUpdate={onConverageUpdated}
      />
      <FieldBox
        name="AP"
        field={annualPremium}
        setField={setAp}
        maxLength={6}
        onFieldUpdate={onApUpdated}
      />
      <FieldBox
        name=" Cost of lead"
        field={costOfLead}
        setField={setCostOfLead}
        onFieldUpdate={onCostUpdated}
      />
    </div>
  );
};
