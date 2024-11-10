"use client";
import { ClipboardList } from "lucide-react";

import { columns } from "./columns";
import { DashBoardTable } from "@/components/tables/dashboard-table";
import { CardLayout } from "@/components/custom/card/layout";
import { PhoneNumber } from "@prisma/client";
import { ItemProps } from "@/types";
import { PhoneLegendItems } from "@/constants/phone";

type MyPhoneNumbers = {
  phoneNumbers: PhoneNumber[];
};

export const MyPhoneNumbers = ({ phoneNumbers }: MyPhoneNumbers) => {
  return (
    <CardLayout title="My PhoneNumbers" icon={ClipboardList}>
      <h6 className="font-normal">Phone number status legend</h6>
      <ul className=" list-disc text-sm font-light leading-tight ml-4">
        {PhoneLegendItems.map((item) => (
          <Item key={item.title} title={item.title} text={item.text} />
        ))}
      </ul>
      <DashBoardTable data={phoneNumbers} columns={columns} />
    </CardLayout>
  );
};

const Item = ({ title, text }: ItemProps) => {
  return (
    <li className="py-0.5">
      <span className="font-bold">{title}</span> {"-"} {text}
    </li>
  );
};
