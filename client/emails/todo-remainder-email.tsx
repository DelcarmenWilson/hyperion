import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Heading,
  Column,
  Row,
} from "@react-email/components";
import { formatDate, formatTime } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

type AppReminderEmailProps = {
  username: string;
  resetLink: string;
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
// const baseUrl = "https://hperioncrm.com";
//TODO - dont forget to remove this after testing has been completed
const baseUrl2 = "https://hperioncrm.com";
const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

type TodoReminderEmailProps = {
  title: string;
  description: string;
  comments: string;
  username: string;
  dueDate: Date;
  todoLink: string;
  todoCompleteLink: string;
};

export const TodoReminderEmail = ({
  title,
  description,
  comments,
  username,
  dueDate,
  todoLink,
  todoCompleteLink,
}: TodoReminderEmailProps) => {
  const date = formatDate(dueDate, "PPP h:mm aa");
  return (
    <Tailwind>
      <Preview>Appointment Reminder</Preview>
      <Body style={main}>
        <Container className="m-w-[480[px] m-0 mx-auto p-2">
          <Section className="text-center p-2 text-black">
            <Text className="font-bold text-center m-0  text-lg">
              Task Reminder
            </Text>
            <Text className="text-right m-0 mt-2">
              <b>Due Date:</b> {date}
            </Text>
            <Text className="text-left m-0">
              <b>Task</b>
            </Text>
            <Text className="text-left m-0 ml-2 border border-separate border-stone-400 p-2 rounded-lg">
              {title}
            </Text>
            <Text className="text-left m-0 mt-2">
              <b>Description</b>
            </Text>
            <Text className="text-left m-0 ml-2 border border-separate border-stone-400 p-2 rounded-lg">
              {description}
            </Text>

            <Text className="text-left m-0 mt-2">
              <b>Comments</b>
            </Text>
            <Text className="text-left m-0 ml-2 border border-separate border-stone-400 p-2 rounded-lg">
              {comments}
            </Text>

            <Text>
              <Link
                href={todoLink}
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Take me to this task
              </Link>
            </Text>
            <Text>
              <Link
                href={todoCompleteLink}
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Mark as Complete
              </Link>
            </Text>
          </Section>

          {/* <Section className="text-center bg-gray-100 "> */}
          <table className="w-full bg-gray-100 ">
            <tr className="w-full">
              <td align="center" className="p-4 pb-0">
                <Img
                  alt="Hyperion logo"
                  height={42}
                  width={42}
                  src={`${baseUrl2}/logo.png`}
                />
              </td>
            </tr>
            <tr className="w-full">
              <td align="center" className="text-[16px] leading-3">
                <Text className="m-0 font-semibold text-gray-900">
                  Hyperion Inc.
                </Text>
                <Text className="m-0 text-gray-500">
                  Solutions that just work
                </Text>
              </td>
            </tr>
            <tr>
              <td align="center">
                <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500 px-4">
                  This email was intended for {username}.{" "}
                  <Link className="text-indigo-600 underline">unsubscribe</Link>{" "}
                  from private messages, or visit your settings to manage what
                  emails Hyperion sends you.
                </Text>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                className="text-[16px] font-semibold leading-3 text-gray-500 pb-4"
              >
                <Text className="m-0">20 Eagle Rock Ave #210</Text>
                <Text className="m-0 leading-3">East Hanover, NJ 07936</Text>
              </td>
            </tr>
          </table>
          {/* </Section> */}
        </Container>
      </Body>
    </Tailwind>
  );
};
