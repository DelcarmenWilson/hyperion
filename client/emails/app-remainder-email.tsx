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
} from "@react-email/components";
import { formatDate, formatTime } from "@/formulas/dates";
import { formatPhoneNumber } from "@/formulas/phones";

type AppReminderEmailProps = {
  username: string;
  resetLink: string;
};

// const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
const baseUrl = "https://hperioncrm.com";
const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

export const AppReminderEmail = ({
  username,
  resetLink,
}: AppReminderEmailProps) => (
  <Tailwind>
    <Preview>Appointment Reminder</Preview>
    <Body style={main}>
      <Container className="m-w-[480[px] m-0 mx-auto p-2">
        <Section className="text-center p-2">
          <Text className="font-bold text-center m-0 text-lg">
            Your Appointment is in 1 Hour,
          </Text>
          <Text className="text-left m-0 mb-2">
            You have an appointment schedule with Jonathan at Strongside
            Financial in 1 hour!
          </Text>

          <Text className="text-left m-0 mb-2">
            Here is your apppointment information:
          </Text>

          <Text className="text-left m-0 mb-2">
            <p>
              <b>Date:</b> September 4, 2024{" "}
            </p>
            <p>
              <b>Time:</b> 11:AM EDT{" "}
            </p>
            <p>
              <b>Location:</b> Phone Call: We will call you at your number (732)
              371-1646
            </p>
          </Text>

          <Text className="text-left m-0 mb-2">
            Your call will be with Jonathan.
          </Text>

          <Text className="font-bold text-center m-0 text-lg">
            Need to Reschedule?
          </Text>

          <Text className="text-left m-0 mb-2">
            We believe you are a person of integrity. If you can't make your
            appointment and need to reschedule or cancel, Please do so by
            clicking the link below so someone else can fill your spot.
          </Text>

          <Text>
            <Link
              href={resetLink}
              className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
            >
              Reschedule Appointment
            </Link>
          </Text>
          <Text>
            <Link
              href={resetLink}
              className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
            >
              Cancel Appointment
            </Link>
          </Text>

          <Text>Talk to you soon!</Text>
          <Text className="font-bold">- Strongside Fiancial Team</Text>
        </Section>
        <Text className="flex justify-center items-center gap-2">
          <Link className="text-[12px] text-[#0366d6]">unsubscribe</Link>
        </Text>

        <Text className="flex justify-center items-center gap-2 text-[12px] text-color-[#6a737d] mt-15">
          <Img
            src={`${baseUrl}/logo3.png`}
            width="20"
            height="20"
            alt="Hyperion"
          />
          Strongside Fiancial, Inc.{"・"}120 Eagle Rock Ave #210{"・"}East
          Hanover, NJ 07936
        </Text>
      </Container>
    </Body>
  </Tailwind>
);

type AppInitailEmailProps = {
  orgName: string;
  firstName: string;
  appId: string;
  dateTime: Date;
  cellPhone: string;
};

export const AppInitailEmail = ({
  orgName,
  firstName,
  appId,
  dateTime,
  cellPhone,
}: AppInitailEmailProps) => {
  const date = formatDate(dateTime);
  const time = formatTime(dateTime);

  return (
    <Tailwind>
      <Preview>Appointment Reminder</Preview>
      <Body style={main}>
        <Container className="m-w-[480[px] m-0 mx-auto p-2">
          <Section className="text-center p-2">
            <Text className="font-bold text-center m-0 text-lg">
              Welcome to the Strongside
            </Text>
            <Text className="text-left m-0 mb-2">
              You have an appointment schedule with {firstName} at {orgName}!
            </Text>

            <Text className="text-left m-0 mb-2">
              Here is your apppointment information:
            </Text>

            <Text className="text-left m-0">
              <b>Date:</b> {date}
            </Text>
            <Text className="text-left m-0">
              <b>Time:</b> {time} EDT
            </Text>
            <Text className="text-left m-b-2">
              <b>Location:</b> Phone Call: We will call you at your number{" "}
              {formatPhoneNumber(cellPhone)}
            </Text>

            <Text className="text-left m-0 mb-2">
              Your call will be with {firstName}.
            </Text>

            <Text className="font-bold text-center m-0 text-lg">
              Need to Reschedule?
            </Text>

            <Text className="text-left m-0 mb-2">
              We believe you are a person of integrity. If you can't make your
              appointment and need to reschedule or cancel, Please do so by
              clicking the link below so someone else can fill your spot.
            </Text>

            <Text>
              <Link
                href=""
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Reschedule Appointment
              </Link>
            </Text>
            <Text>
              <Link
                href=""
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Cancel Appointment
              </Link>
            </Text>

            <Text>Talk to you soon!</Text>
            <Text className="font-bold">- {orgName} Team</Text>
          </Section>
          <Text className="flex justify-center items-center gap-2">
            <Link className="text-[12px] text-[#0366d6]">unsubscribe</Link>
          </Text>

          <Text className="flex justify-center items-center gap-1 text-[12px] text-color-[#6a737d] mt-15">
            <Img
              src={`${baseUrl}/logo3.png`}
              width="20"
              height="20"
              alt="Hyperion"
            />
            {orgName}, Inc.{"・"}120 Eagle Rock Ave #210{"・"}East Hanover, NJ
            07936
          </Text>
        </Container>
      </Body>
    </Tailwind>
  );
};
