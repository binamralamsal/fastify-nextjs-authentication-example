import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { authenticator } from "otplib";

import { site } from "@/configs/site";
import { TwoFactorAuthenticationForm } from "@/features/auth/components/2fa-form";
import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { api } from "@/utils/server-api";

export default async function SettingsPage() {
  const response = await api
    .get("/api/auth/profile", { headers: { cookie: cookies().toString() } })
    .json();

  if (!response.ok) return redirect("/");

  const secret = authenticator.generateSecret();
  const authenticatorURI = authenticator.keyuri(
    response.data.email,
    site.name,
    secret,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <ChangePasswordForm />

      <TwoFactorAuthenticationForm
        authenticatorURI={authenticatorURI}
        secret={secret}
        is2faEnabled={response.data.is2faEnabled}
      />
    </div>
  );
}
