import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { createRoom, getRooms } from "@/services/room-services";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

interface Room {
  roomId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

const MyRooms = () => {
  const { data: session, status } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRoom = async () => {
    setIsLoading(true);
    try {
      const res = await getRooms(session?.user?.id || "");
      if (res?.status === 200) {
        setRooms(res.data);
      } else {
        console.error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      handleGetRoom();
    }
  }, [status]);

  const handleCreateRoom = async () => {
    // Implement room creation functionality or navigation
    const res = await createRoom();
    console.log("Create room clicked");
  };

  return (
    <Card>
      {/* Create Room Button  */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Rooms</CardTitle>
        <Button size="sm" onClick={handleCreateRoom}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Room
        </Button>
      </CardHeader>

      {/* Rooms list  */}
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4">
            {/* Display 3 skeleton items while loading */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-[180px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[80px]" />
              </div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid gap-4">
            {rooms.map((room, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{room.name}</h3>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      {room.roomId}
                    </p>
                    <p
                      className={`text-sm ${
                        room.status === "active"
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {room.status}
                    </p>
                  </div>
                </div>
                {room.status === "active" ? (
                  <Link href={`/room/${room.roomId}`}>
                    <Button variant="outline" size="sm">
                      Go to Room
                    </Button>
                  </Link>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You haven't created any rooms yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyRooms;
