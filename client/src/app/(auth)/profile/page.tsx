import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@/utils/server-api";

export default async function ProfilePage() {
  const response = await api
    .get("/api/auth/profile", { headers: { cookie: cookies().toString() } })
    .json();

  if (!response.ok) return redirect("/");
  const { data } = response;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <ul>
        <li>
          <strong>Name: </strong>
          {data.name}
        </li>
        <li>
          <strong>Email: </strong>
          {data.email}
        </li>
        <li>
          <strong>Two Factor Authentication: </strong>
          {data.is2faEnabled ? "Enabled" : "Disabled"}
        </li>
      </ul>
    </div>
  );
}
