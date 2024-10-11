"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { api } from "@/utils/client-api";

import { searchParamsSchema } from "./search-params-dto";

export default function ResetPassword({
  searchParams,
}: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await api
      .post("/api/auth/reset-password", {
        body: { ...searchParams, password: newPassword },
      })
      .json();

    if (response.ok) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

    router.push("/");
  }

  function handleChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <form
        className="w-full max-w-md rounded bg-white p-6 shadow-md"
        onSubmit={handleResetPassword}
      >
        <h2 className="mb-4 text-2xl font-bold">Reset Password</h2>
        <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            onChange={handleChange(setNewPassword)}
            placeholder="Password"
            required
            type="password"
            value={newPassword}
          />
        </div>

        <Button className="w-full" size="lg" type="submit">
          Reset Password
        </Button>
      </form>
    </div>
  );
}
