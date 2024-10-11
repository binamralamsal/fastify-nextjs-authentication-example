"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/configs/site";
import { QRCodeCanvas } from "@/libs/qrcode";
import { api } from "@/utils/client-api";

export function TwoFactorAuthenticationForm(data: {
  authenticatorURI: string;
  secret: string;
}) {
  const [code, setCode] = useState("");

  function handleChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  }

  async function handleTurnOn2fa(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await api
      .post("/api/auth/enable-2fa", {
        body: { secret: data.secret, token: code },
      })
      .json();

    if (response.ok) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  }

  async function handleGenerateBackupCodes() {
    const response = await api.post("/api/auth/regenerate-backup-codes").json();

    if (response.ok) {
      toast.success(response.data.message);

      const backupCodesText = generateFormattedBackupCodeText(
        response.data.backupCodes,
        response.data.email,
      );

      downloadBackupCodes(backupCodesText);
    } else {
      toast.error(response.data.message);
    }
  }

  function generateFormattedBackupCodeText(codes: string[], email: string) {
    const header = `These are your ${site.name} Backup Code for account ${email}. Keep them safe!\n\n`;
    const formattedCodes = codes.map((code) => `* ${code}`).join("\n");
    return header + formattedCodes;
  }

  function downloadBackupCodes(text: string) {
    const blob = new Blob([text], { type: "text/plain" });

    const link = document.createElement("a");
    link.download = `${site.name.toLowerCase().split(" ").join("-")}-backup-codes.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <QRCodeCanvas value={data.authenticatorURI} />
      <form
        className="w-full max-w-md rounded bg-white p-6 shadow-md"
        onSubmit={handleTurnOn2fa}
      >
        <h2 className="mb-4 text-2xl font-bold">Turn on 2fa</h2>
        <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            onChange={handleChange(setCode)}
            placeholder="Code"
            required
            type="text"
            value={code}
          />
        </div>

        <Button className="w-full" size="lg" type="submit">
          Turn on 2fa
        </Button>
        <Button
          className="w-full mt-2"
          size="lg"
          variant="outline"
          type="button"
          onClick={handleGenerateBackupCodes}
        >
          Re/Generate and Download Backup Codes
        </Button>
        <p className="text-sm mt-2 text-gray-500">
          This is great if you lose your 2fa app somehow. Remember to save this
          backup codes somewhere. You won&apos;t get this backup code again;
          unless you regenerate it.
        </p>
      </form>
    </>
  );
}
