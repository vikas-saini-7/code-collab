"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axios from "axios";
import { toast } from "sonner";

const RoomForm = ({
  room,
  setRoom,
  handleJoinRoom,
}: {
  room: string;
  setRoom: (room: string) => void;
  handleJoinRoom: () => void;
}) => (
  <Card className="w-full max-w-md bg-[#171717] border-[#2A2A2A]">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">Join a Room</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Room ID"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      {room ? (
        <Button
          className="w-full bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
          onClick={handleJoinRoom}
          size="lg"
        >
          Join Room
        </Button>
      ) : (
        <Button className="w-full bg-gray-700 text-gray-200" disabled size="lg">
          Join Room
        </Button>
      )}
    </CardContent>
  </Card>
);

export default function Page() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });
  const [room, setRoom] = useState("");
  const params = useParams();

  useEffect(() => {
    // Extract roomId from URL params and set it as the initial value
    if (params && params.roomId) {
      const roomIdFromUrl = params.roomId as string;
      setRoom(roomIdFromUrl);
    }
  }, [params]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const handleJoinRoom = async () => {
    try {
      if (!room) {
        toast.error("Please enter a room ID");
        return;
      }
      // Make the POST request to create the room
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/join`,
        { roomId: room },
        { withCredentials: true }
      );

      console.log("Response:", response.data);
      if (response.data.success) {
        router.push(`/room/${room}`);
      }
      //   return response.data.data;
    } catch (err) {
      console.error("Error Joining room:", err);
      toast.error(
        "Error joining room. Please check the room ID and try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 p-8 flex items-center justify-center relative">
        <RoomForm
          room={room}
          setRoom={setRoom}
          handleJoinRoom={handleJoinRoom}
        />
      </div>

      {/* Right side - Branding */}
      <div className="w-1/2 bg-gradient-to-br from-black/50 to-[#171717] p-8 flex flex-col items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="z-10 text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Code Collab<span className="text-[#00E87B]">.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
            Experience seamless real-time code collaboration with your team
          </p>
          <div className="flex gap-12 justify-center mt-12">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#00E87B]">100+</h3>
              <p className="text-sm text-gray-500 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-[#00E87B]">50K+</h3>
              <p className="text-sm text-gray-500 mt-2">Lines of Code</p>
            </div>
          </div>
          <div className="pt-12">
            <p className="text-sm text-gray-600">
              Trusted by developers worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
