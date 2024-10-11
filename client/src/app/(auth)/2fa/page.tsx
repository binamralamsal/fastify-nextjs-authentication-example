import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticator } from "otplib";

import { site } from "@/configs/site";
import { api } from "@/utils/server-api";

import { TwoFactorAuthenticationForm } from "./2fa-form";

export default async function TwoFactorAuthentication() {
  const secret = authenticator.generateSecret();

  const response = await api
    .get("/api/auth/me", {
      headers: {
        cookie: cookies().toString(),
      },
    })
    .json();

  if (!response.ok) return redirect("/");

  const authenticatorURI = authenticator.keyuri(
    response.data.email,
    site.name,
    secret,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <TwoFactorAuthenticationForm
        authenticatorURI={authenticatorURI}
        secret={secret}
      />
    </div>
  );
}
