import Link from "next/link";

import { getServerUser } from "@/features/auth/use-cases/get-server-user";

import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";

export async function SiteHeader() {
  const response = await getServerUser();

  const isLoggedIn = response.ok;
  let name = "";

  if (response.ok) name = response.data.name;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-3 shadow-[0_8px_30px_rgb(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/">Auth Sample</Link>
      <DesktopNav isLoggedIn={isLoggedIn} name={name} />
      <MobileNav isLoggedIn={isLoggedIn} />
    </header>
  );
}
