"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import logo from "@/assets/logo.png"; // Adjust the path as necessary

type User = {
  id: string;
  name: string;
  email: string;
} | null;

export function Header() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    console.log("Session data:", session);
    setUser({
      id: session?.user?.id || "",
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    });
  }, [session]);

  return (
    <header className="border-b bg-background z-10">
      <div className="container mx-auto px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Code Collab logo text */}
          <Link href="/" className="flex items-center ">
            <Image
              src={logo}
              alt="Code Collab Logo"
              className="w-10 mr-2 rounded-md"
            />
            <span className="text-xl font-bold">Code Collab</span>
          </Link>
        </div>

        {/* Right section with profile/login */}
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/me">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href={"/login"}>
              <Button variant="default">Log in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
