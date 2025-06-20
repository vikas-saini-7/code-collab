"use client";
import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import MyRooms from "@/components/me/MyRooms";

interface User {
  id: string;
  name: string;
  email: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session?.user) {
      setUser({
        id: session.user.id || "",
        name: session.user.name || "User",
        email: session.user.email || "user@example.com",
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto max-w-[1080px] px-8 py-12">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold capitalize">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="rooms">My Rooms</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="rooms">
              <MyRooms />
            </TabsContent>

            <TabsContent value="privacy">
              <div>Coming soon..</div>
            </TabsContent>

            <TabsContent value="security">
              <div>Coming soon..</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
