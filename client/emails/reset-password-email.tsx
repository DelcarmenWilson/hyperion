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

type Props = {
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

export const ResetPasswordEmail = ({ username, resetLink }: Props) => (
  <Tailwind>
    <Preview>Reset Password</Preview>
    <Body style={main}>
      <Container className="m-w-[480[px] m-0 mx-auto p-2">
        <Section className="text-center p-2">
          <Text className="text-left m-0 text-lg">
            Hello <b>{username}</b>,
          </Text>
          <Text className="text-left m-0 mb-2">
            Please follow this link to reset your password:
          </Text>
          {/* <Link href={resetLink}>{resetLink}</Link>
          <Text className="text-left m-0">This link expires in hour!</Text>

          <Text className="font-bold text-left m-0 mb-2">
            ** If this was not you please ignore
          </Text> */}
          <Link
            href={resetLink}
            className="text-[14px] bg-[#28a745] text-white p-2 rounded-lg my-2"
          >
            Reset your Password
          </Link>
          <Text className="text-sm italic">(Link exprires in 1 hour)</Text>

          <Text className="text-left m-0">Best wishes</Text>
          <Text className="font-bold text-left m-0">Hyperion Team</Text>
        </Section>
        <Text className="flex justify-center items-center gap-2">
          <Link className="text-[12px] text-[#0366d6]">
            Your security audit log
          </Link>
          {"・"}
          <Link className="text-[12px] text-[#0366d6]">Contact support</Link>
        </Text>

        <Text className="flex justify-center items-center gap-2 text-[12px] text-color-[#6a737d] mt-15">
          <Img
            src={`${baseUrl}/logo.png`}
            width="20"
            height="20"
            alt="Hyperion"
          />
          Hyperion, Inc.{"・"}120 Eagle Rock Ave #210{"・"}East Hanover, NJ
          07936
        </Text>
      </Container>
    </Body>
  </Tailwind>
);

export default ResetPasswordEmail;
