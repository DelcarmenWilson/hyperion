"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { PhoneNumberColumn, columns } from "./columns";
import { DashBoardTable } from "../../dashboard/components/dashboard-table";

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
    <Card className="relative overflow-hidden w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-accent p-4 rounded-br-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className=" text-sm text-muted-foreground">
            My Phone Numbers
          </CardTitle>
        </div>
      </div>
      <CardContent className="items-center space-y-0 pb-2">
        <h6 className="font-normal">Phone number status legend</h6>
        <ul className=" list-disc text-sm font-light leading-tight ml-4">
          {items.map((item) => (
            <Item key={item.title} title={item.title} text={item.text} />
          ))}
        </ul>
        <DashBoardTable
          data={phoneNumbers}
          columns={columns}
          searchKey="phone"
        />
      </CardContent>
    </Card>
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
