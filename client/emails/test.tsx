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

interface Props {
  username?: string;
}

// const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
const baseUrl = "https://hperioncrm.com";

export const TestEmail = ({ username }: Props) => (
  <Tailwind>
    <Preview>
      A fine-grained personal access token has been added to your account
    </Preview>
    <Body className="bg-white text-[#24292e]" style={main}>
      <Container className="m-w-[480[px] m-0 mx-auto p-2">
        <Img src={`${baseUrl}/logo.png`} width="32" height="32" alt="Github" />

        <Text className="text-[24px] leading-tight">
          <strong>@{username}</strong>, a personal access was created on your
          account.
        </Text>

        <Section className="border rounded-lg text-center p-2">
          <Text className="mb-2 text-left pl-2">
            Hey <strong>{username}</strong>!
          </Text>
          <Text className="mb-2 text-left pl-2">
            A fine-grained personal access token (<Link>resend</Link>) was
            recently added to your account.
          </Text>

          <Button className="text-[14px] bg-[#28a745] text-white leading-3 py-2 px-3 rounded-lg mb-2">
            View your token
          </Button>
        </Section>
        <Text className="text-center">
          <Link className="text-[12px] text-[#0366d6]">
            Your security audit log
          </Link>{" "}
          ・{" "}
          <Link className="text-[12px] text-color-[#0366d6]">
            Contact support
          </Link>
        </Text>

        <Text className=" text-[12px] text-color-[#6a737d] text-center mt-15">
          GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
        </Text>
      </Container>
    </Body>
  </Tailwind>
);

// export const TestEmail = ({ username }: Props) => (
//   <Html>
//     <Head />
//     <Preview>
//       A fine-grained personal access token has been added to your account
//     </Preview>
//     <Body style={main}>
//       <Container style={container}>
//         <Img src={`${baseUrl}/logo.png`} width="32" height="32" alt="Github" />

//         <Text style={title}>
//           <strong>@{username}</strong>, a personal access was created on your
//           account.
//         </Text>

//         <Section style={section}>
//           <Text style={text}>
//             Hey <strong>{username}</strong>!
//           </Text>
//           <Text style={text}>
//             A fine-grained personal access token (<Link>resend</Link>) was
//             recently added to your account.
//           </Text>

//           <Button style={button}>View your token</Button>
//         </Section>
//         <Text style={links}>
//           <Link style={link}>Your security audit log</Link> ・{" "}
//           <Link style={link}>Contact support</Link>
//         </Text>

//         <Text style={footer}>
//           GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
//         </Text>
//       </Container>
//     </Body>
//   </Html>
// );

TestEmail.PreviewProps = {
  username: "alanturing",
} as Props;

export default TestEmail;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};
