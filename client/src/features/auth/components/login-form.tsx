"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

import { forgotPasswordUrl } from "@/configs/site";
import { api } from "@/utils/client-api";

export function LoginForm() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginToken, setLoginToken] = useState("");
  const [loginBackupCode, setLoginBackupCode] = useState("");

  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await api
      .post("/api/auth/authorize", {
        body: {
          email: loginEmail,
          password: loginPassword,
          token: loginToken ? loginToken : undefined,
          backupCode: loginBackupCode ? loginBackupCode : undefined,
        },
      })
      .json();

    if (response.ok) {
      toast.success(response.data.message);
      router.push("/");
      router.refresh();
    } else {
      toast.error(response.data.message);
    }
  }

  function handleChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  }

  return (
    <form
      className="w-full max-w-md rounded bg-white p-6 shadow-md"
      onSubmit={handleLogin}
    >
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginEmail">Email</Label>
        <Input
          id="loginEmail"
          onChange={handleChange(setLoginEmail)}
          placeholder="Email"
          required
          type="email"
          value={loginEmail}
        />
      </div>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginPassword">Password</Label>
        <Input
          id="loginPassword"
          onChange={handleChange(setLoginPassword)}
          placeholder="Password"
          required
          type="password"
          value={loginPassword}
        />
      </div>

      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginToken">Token (optional)</Label>
        <Input
          id="loginToken"
          onChange={handleChange(setLoginToken)}
          placeholder="2fa Token"
          type="number"
          value={loginToken}
        />
      </div>

      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="loginBackupCode">Backup Code (optional)</Label>
        <Input
          id="loginBackupCode"
          onChange={handleChange(setLoginBackupCode)}
          placeholder="Backup Code"
          type="text"
          value={loginBackupCode}
        />
      </div>

      <Button className="w-full" size="lg" type="submit">
        Login
      </Button>

      <small className="text-gray-600 flex gap-2 items-center">
        Forgot Password?
        <Button asChild variant="link" className="p-0">
          <Link href={forgotPasswordUrl}>Click Here</Link>
        </Button>
      </small>
    </form>
  );
}
