import "server-only";

import { cookies } from "next/headers";

import { api } from "@/utils/server-api";

export async function getServerUser() {
  return await api
    .get("/api/auth/me", {
      headers: {
        cookie: cookies().toString(),
      },
    })
    .json();
}
