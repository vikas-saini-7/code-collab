"use client";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import Link from "next/link";
import { setRoomId } from "@/redux/reducers/roomReducer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const RoomForm = ({
  room,
  setRoom,
  handleSetDetails,
}: {
  room: string;
  setRoom: (room: string) => void;
  handleSetDetails: () => void;
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
        <Link href={`/room/${room}/files`} className="w-full block">
          <Button
            className="w-full bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
            onClick={handleSetDetails}
            size="lg"
          >
            Join Room
          </Button>
        </Link>
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
  const dispatch = useAppDispatch();
  const [room, setRoom] = useState("");

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  const handleSetDetails = () => {
    dispatch(setRoomId(room));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 p-8 flex items-center justify-center relative">
        <RoomForm
          room={room}
          setRoom={setRoom}
          handleSetDetails={handleSetDetails}
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
