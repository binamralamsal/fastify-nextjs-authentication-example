"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

import { api } from "@/utils/client-api";

export function ChangePasswordForm() {
  const [changeOldPassword, setChangeOldPassword] = useState("");
  const [changeNewPassword, setChangeNewPassword] = useState("");

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await api
      .post("/api/auth/change-password", {
        body: {
          newPassword: changeNewPassword,
          oldPassword: changeOldPassword,
        },
      })
      .json();

    if (!response.ok) {
      toast.error(response.data.message);
    } else {
      toast.success(response.data.message);
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
      onSubmit={handleChangePassword}
    >
      <h2 className="mb-4 text-2xl font-bold">Change Password</h2>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="changeOldPassword">Old Password</Label>
        <Input
          id="changeOldPassword"
          onChange={handleChange(setChangeOldPassword)}
          placeholder="Old Password"
          required
          type="password"
          value={changeOldPassword}
        />
      </div>
      <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="changeNewPassword">New Password</Label>
        <Input
          id="changeNewPassword"
          onChange={handleChange(setChangeNewPassword)}
          placeholder="New Password"
          required
          type="password"
          value={changeNewPassword}
        />
      </div>
      <Button className="w-full" size="lg" type="submit">
        Change Password
      </Button>
    </form>
  );
}
