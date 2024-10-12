"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";

import { LogOut, Settings, User } from "lucide-react";

import { profileUrl, settingsUrl } from "@/configs/site";
import { api } from "@/utils/client-api";

export function UserAccountDropdown({ name }: { name: string }) {
  const router = useRouter();

  async function handleLogout() {
    const response = await api.post("/api/auth/logout").json();

    if (response.ok) {
      toast.success(response.data.message);
      router.refresh();
    } else {
      toast.error(response.data.message);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Avatar className="h-full w-full">
            {/* <AvatarImage src={avatarURL} /> */}
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="gap-2" asChild>
          <Link href={profileUrl}>
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" asChild>
          <Link href={settingsUrl}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
