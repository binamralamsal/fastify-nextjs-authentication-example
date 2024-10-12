"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

import { api } from "@/utils/client-api";

export function ForgotPasswordForm() {
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  async function handleForgotPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await api
      .post("/api/auth/forgot-password", {
        body: { email: forgotPasswordEmail },
      })
      .json();

    if (response.ok) {
      toast.success(response.data.message);
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
      onSubmit={handleForgotPassword}
    >
      <h2 className="mb-4 text-2xl font-bold">Forgot Password</h2>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="forgotPasswordEmail">Email</Label>
        <Input
          id="forgotPasswordEmail"
          onChange={handleChange(setForgotPasswordEmail)}
          placeholder="email@website.com"
          required
          type="email"
          value={forgotPasswordEmail}
        />
      </div>
      <Button className="w-full" size="lg" type="submit">
        Send Reset Password Email
      </Button>
    </form>
  );
}
