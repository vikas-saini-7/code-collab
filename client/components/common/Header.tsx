"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { IconLogout, IconUser, IconUserCircle } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import { RootState } from "@/redux/store";

const Header = () => {
  const { data: session, status } = useSession();
  const profile = useSelector((state: RootState) => state.profile);
  const isLoading = status === "loading";

  const renderProfileSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      );
    }

    if (session) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback>
                  <span className="text-white/70">
                    <IconUser size={18} />
                  </span>
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {profile.fullName || session.user?.name || "User"}
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#171717]">
            <DropdownMenuItem>
              <Link href="/profile" className="w-full flex items-center gap-2">
                <IconUserCircle size={18} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className="flex items-center gap-2"
            >
              <IconLogout size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="secondary">Login</Button>
        </Link>
        <Link href="/signup">
          <Button>Signup</Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between container mx-auto py-4 px-4 border-b border-white/10">
      <Link href="/">
        <h1 className="text-2xl font-bold tracking-tighter">
          Code Collab<span className="text-[#00E87B]">.</span>
        </h1>
      </Link>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-8">
        <Link
          href="/how-it-works"
          className="hover:text-[#00E87B] transition-all duration-300"
        >
          How it works
        </Link>
        <Link
          href="/contact"
          className="hover:text-[#00E87B] transition-all duration-300"
        >
          Contact
        </Link>
        <Link
          href="/about"
          className="hover:text-[#00E87B] transition-all duration-300"
        >
          About
        </Link>
      </nav>

      <div>{renderProfileSection()}</div>
    </div>
  );
};

export default Header;
