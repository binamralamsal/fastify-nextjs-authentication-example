import { redirect } from "next/navigation";

import { getServerUser } from "./get-server-user";

export async function redirectIfAuthorized(path = "/") {
  const response = await getServerUser();
  if (response.ok) redirect(path);
}

export async function redirectIfUnauthorized(path = "/login") {
  const response = await getServerUser();
  if (!response.ok) return redirect(path);

  return response.data;
}
