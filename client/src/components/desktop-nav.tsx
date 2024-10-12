"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { loginUrl, navLinks, registerUrl } from "@/configs/site";
import { UserAccountDropdown } from "@/features/auth/components/user-account-dropdown";
import { cn } from "@/utils/cn";

import { Button } from "./ui/button";

export function DesktopNav(props: { isLoggedIn: boolean; name: string }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden md:block">
        <ul className="flex">
          {navLinks.map((navLink) => (
            <li key={navLink.label}>
              <Button
                variant="link"
                className={cn(
                  "p-4 text-sm text-gray-600 hover:text-black",
                  pathname === navLink.href && "font-medium text-black",
                )}
                asChild
              >
                <Link href={navLink.href}>{navLink.label}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="hidden md:block">
        {props.isLoggedIn ? (
          <UserAccountDropdown
            name={props.name
              .split(" ")
              .map((p) => p.charAt(0).toUpperCase())
              .join("")
              .slice(0, 2)}
          />
        ) : (
          <ul className="flex gap-2">
            <li>
              <Button variant="link" asChild>
                <Link href={loginUrl}>Login</Link>
              </Button>
            </li>
            <li>
              <Button asChild>
                <Link href={registerUrl}>Sign Up</Link>
              </Button>
            </li>
          </ul>
        )}
      </nav>
    </>
  );
}
