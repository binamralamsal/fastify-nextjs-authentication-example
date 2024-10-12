"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

import { api } from "@/utils/client-api";

export function GetMeButton() {
  async function handleGetMe() {
    const response = await api.get("/api/auth/me").json();

    if (response.ok) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleGetMe}
      size="lg"
      type="button"
      variant="outline"
    >
      Get Me
    </Button>
  );
}
