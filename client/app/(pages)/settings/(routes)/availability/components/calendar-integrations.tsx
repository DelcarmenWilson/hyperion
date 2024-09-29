import { Button } from "@/components/ui/button";
import { Heading } from "@/components/custom/heading";

export const CalendarIntegrations = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CalendarIntegrationForm open={open} onClose={() => setOpen(false)} />
      <div className="flex-1">
        <Heading title="Calendar Integrations" size="text-xl" center />
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 items-center">
            <Button className="w-[100px]" type="button" asChild>
              <Link
                href="https://auth.calendly.com/oauth/authorize?client_id=E1So8pVERZerhvXZEQu7ZLabfgcjhQtQswzBr9HlhwA&response_type=code&redirect_uri=http://localhost:3000/auth/calendly"
                target="_blank"
                type="popup"
              >
                Calendly
              </Link>
            </Button>
            NOT CONNECTED
          </div>
          <div className="grid grid-cols-2 items-center">
            <Button className="w-[100px]" type="button">
              Google
            </Button>
            NOT CONNECTED
          </div>
          <div className="grid grid-cols-2 items-center ">
            <Button className="w-[100px]" type="button">
              Outlook
            </Button>
            NOT CONNECTED
          </div>
        </div>
      </div>
    </>
  );
};

import { Input } from "@/components/ui/input";
import { CustomDialog } from "@/components/global/custom-dialog";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

type Props = {
  open: boolean;
  onClose: () => void;
};
const CalendarIntegrationForm = ({ open, onClose }: Props) => {
  const onSubmit = async () => {
    // const baseUrl = "https://api.calendly.com/webhook_subscriptions";
    const baseUrl = "https://api.calendly.com/oauth/authorize";

    const token = "E1So8pVERZerhvXZEQu7ZLabfgcjhQtQswzBr9HlhwA";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    // axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    // const response = await axios.post(baseUrl, {
    //   url: "https://insect-pro-luckily.ngrok-free.app/integrations/calendly",
    //   events: [
    //     "invitee.created",
    //     "invitee.canceled",
    //     "invitee_no_show.created",
    //     "invitee_no_show.deleted",
    //   ],
    //   user: "https://api.calendly.com/users/delcarmenwilson",
    //   scope: "user",
    //   signing_key: "ioqXd06CiTLsPwbjqsVkXMEW7Forru5DworYP1lbnpY",
    // });

    // const response = await axios.get(
    //   baseUrl
    // );
    const response = axios.get(
      "https://auth.calendly.com/oauth/authorize?client_id=E1So8pVERZerhvXZEQu7ZLabfgcjhQtQswzBr9HlhwA&response_type=code&redirect_uri=http://localhost:3000/auth/calendly"
    );
    console.log(response);
  };
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      description="Calendly Integration"
      title="Calendly Integration"
    >
      <Heading title="Username" />
      <Input placeholder="Username" />
      <Heading title="Password" />
      <Input type="password" placeholder="Username" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Button variant="destructive" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button variant="outlineprimary" onClick={onSubmit} type="button">
          Connect
        </Button>
      </div>
    </CustomDialog>
  );
};
