"use client";
import { ClipboardList } from "lucide-react";

import { PhoneNumberColumn, columns } from "./columns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { CardLayout } from "@/components/custom/card-layout";

type ItemType = {
  title: string;
  text: string;
};
interface MyPhoneNumbers {
  phoneNumbers: PhoneNumberColumn[];
}
export const MyPhoneNumbers = ({ phoneNumbers }: MyPhoneNumbers) => {
  const items: ItemType[] = [
    {
      title: "Active",
      text: "can send and recieve calls and texts.",
    },
    {
      title: "Inactive",
      text: "can recieve calls and texts, but will not be used for outbound calls and texts.",
    },
    {
      title: "Default",
      text: "if you do not have a phone number in a particular state, we will choose this phone number for calls and texts.",
    },
    {
      title: "Special Number",
      text: "this phone number will be used for all outbound calls made to leads that have never sent you a text message. The first time a lead texts you, the phone number used fot that lead will then be updated",
    },
    {
      title: "Used for live transfers",
      text: "this phone number is assigned to one of you leas venderors for live transfer. You must unlink this phone number from your lead vendor if you want to delete it from you account.",
    },
  ];
  return (
    <CardLayout title="Purchase Phone Numbers" icon={ClipboardList}>
      <h6 className="font-normal">Phone number status legend</h6>
      <ul className=" list-disc text-sm font-light leading-tight ml-4">
        {items.map((item) => (
          <Item key={item.title} title={item.title} text={item.text} />
        ))}
      </ul>
      <DashBoardTable data={phoneNumbers} columns={columns} searchKey="phone" />
    </CardLayout>
  );
};

interface ItemProps {
  title: string;
  text: string;
}
export const Item = ({ title, text }: ItemProps) => {
  return (
    <li className="py-0.5">
      <span className="font-bold">{title}</span> {"-"} {text}
    </li>
  );
};
