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
  teamName: string;
  firstName: string;
  dateTime: Date;
  cellPhone: string;
  rescheduleLink: string;
  cancelLink: string;
};

export const AppInitailEmail = ({
  teamName,
  firstName,
  dateTime,
  cellPhone,
  rescheduleLink,
  cancelLink,
}: AppInitailEmailProps) => {
  const date = formatDate(dateTime);
  const time = formatTime(dateTime);
  return (
    <Tailwind>
      <Preview>Appointment Reminder</Preview>
      <Body style={main}>
        <Container className="m-w-[480[px] m-0 mx-auto p-2">
          <Section className="text-center p-2 text-black">
            <Text className="font-bold text-center m-0 text-lg">
              Welcome to the Strongside
            </Text>
            <Text className="text-left m-0 mb-2">
              You have an appointment scheduled with {teamName}!
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
            <Text className="text-left m-0 mb-2">
              <b>Location:</b> Phone Call - We will call you at your number{" "}
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
                href={rescheduleLink}
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Reschedule Appointment
              </Link>
            </Text>
            <Text>
              <Link
                href={cancelLink}
                className="text-[14px] bg-[#0f1b8c] text-white p-2 rounded-lg"
              >
                Cancel Appointment
              </Link>
            </Text>

            <Text>Talk to you soon!</Text>
            <Text className="font-bold italic">- {teamName} Team</Text>
          </Section>

          {/* <Section className="text-center bg-gray-100 "> */}
          <table className="w-full bg-gray-100 ">
            <tr className="w-full">
              <td align="center" className="p-4 pb-0">
                <Img
                  alt="Hyperion logo"
                  height={42}
                  width={42}
                  src={`${baseUrl2}/logo3.png`}
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
                {/* <Row className="table-cell h-[44px] w-[56px] align-bottom">
                    <Column className="pr-[8px]">
                      <Link href="#">
                        <Img
                          alt="Facebook"
                          height="36"
                          src="/static/facebook-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column className="pr-[8px]">
                      <Link href="#">
                        <Img
                          alt="X"
                          height="36"
                          src="/static/x-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link href="#">
                        <Img
                          alt="Instagram"
                          height="36"
                          src="/static/instagram-logo.png"
                          width="36"
                        />
                      </Link>
                    </Column>
                  </Row> */}
                <Text className="mt-[8px] text-[16px] leading-[24px] text-gray-500 px-4">
                  This email was intended for {firstName}.{" "}
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
