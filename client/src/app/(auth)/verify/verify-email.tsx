"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";
import type { z } from "zod";

import { toast } from "@/components/ui/sonner";
import { api } from "@/utils/client-api";

import type { searchParamsSchema } from "./search-params-dto";

export function VerifyEmail({
  searchParams,
}: {
  searchParams: z.infer<typeof searchParamsSchema>;
}) {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    async function verifyEmail() {
      const response = await api
        .post("/api/auth/verify", {
          body: searchParams,
          signal: controller.signal,
        })
        .json();

      if (!response.ok) throw new Error(response.data.message);
      return response.data;
    }

    verifyEmail()
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        toast.error(error.message);
      })
      .finally(() => {
        router.replace("/");
      });

    return () => {
      controller.abort();
    };
  }, [router, searchParams]);

  return <div>We are verifying your email</div>;
}
