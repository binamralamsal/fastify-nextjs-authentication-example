import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { parseCookies } from "@/libs/parse-cookies";
import { api } from "@/utils/server-api";

export default async function middleware(request: NextRequest) {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;
    const accessToken = cookies().get("accessToken")?.value;

    if (accessToken || !refreshToken) return NextResponse.next();

    const response = await api
      .get("/api/auth/me", {
        headers: {
          cookie: cookies().toString(),
        },
      })
      .json();
    const responseCookie = response.headers.get("set-cookie");
    if (!responseCookie) throw new Error("No set-cookie header in response");

    const parsedCookies = parseCookies(responseCookie);
    const redirectResponse = NextResponse.redirect(request.url);

    redirectResponse.cookies.set(
      "accessToken",
      parsedCookies.accessToken?.value || "",
      parsedCookies.accessToken?.attributes,
    );
    redirectResponse.cookies.set(
      "refreshToken",
      parsedCookies.refreshToken?.value || "",
      parsedCookies.refreshToken?.attributes,
    );
    return redirectResponse;
  } catch (err) {
    console.error("Error in middleware:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
