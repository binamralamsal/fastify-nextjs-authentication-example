import { env } from "@/env";
import { APIFetcher } from "@/libs/fetcher";
import { API } from "@/types/api-types";

export const api = new APIFetcher<API>({
  baseUrl: env.NEXT_PUBLIC_CLIENT_API,
  credentials: "include",
});
