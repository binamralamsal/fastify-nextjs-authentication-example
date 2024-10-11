import * as React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface Props {
  url: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const ResetPasswordEmail = ({ url }: Props) => (
  <Html>
    <Head />
    <Preview>Reset your password with this link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Password</Heading>
        <Link
          href={url}
          target="_blank"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
          Click here to reset your password
        </Link>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          This link will expire in 24 hrs. If you didn&apos;t try to reset your
          password, you can safely ignore this email.
        </Text>
        <Img
          src={`${baseUrl}/static/notion-logo.png`}
          width="32"
          height="32"
          alt="Notion's Logo"
        />
        <Text style={footer}>
          <Link
            href="https://binamralamsal.com"
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Binamra Lamsal
          </Link>
          , the best
          <br />
          place to live.
        </Text>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  url: "https://binamralamsal.com/verify?token=asdf&email=asdf",
} satisfies Props;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

// const code = {
//   display: "inline-block",
//   padding: "16px 4.5%",
//   width: "90.5%",
//   backgroundColor: "#f4f4f4",
//   borderRadius: "5px",
//   border: "1px solid #eee",
//   color: "#333",
// };
