"use client";
import { useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { setRoomId } from "@/redux/reducers/roomReducer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format } from "date-fns";

const RoomForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [roomType, setRoomType] = useState<"instant" | "scheduled">("instant");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");

  const generateRandomRoomId = () => {
    const generateSegment = () => Math.random().toString(36).substring(2, 5);
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const handleCreateRoom = () => {
    if (roomType === "instant") {
      const roomId = generateRandomRoomId();
      dispatch(setRoomId(roomId));
      router.push(`/room/${roomId}/files`);
    } else {
      if (!date || !time) return;
      // Here you can implement scheduled room creation logic
      // For now, we'll just create the room and store the schedule
      const roomId = generateRandomRoomId();
      const scheduledTime = new Date(date);
      const [hours, minutes] = time.split(":");
      scheduledTime.setHours(parseInt(hours), parseInt(minutes));

      // You can store this scheduled room info in your backend
      console.log("Scheduled room:", {
        roomId,
        scheduledTime: scheduledTime.toISOString(),
      });

      dispatch(setRoomId(roomId));
      router.push(`/room/${roomId}/files`);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#171717] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create a Room</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Select
            value={roomType}
            onValueChange={(value: "instant" | "scheduled") =>
              setRoomType(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant Room</SelectItem>
              <SelectItem value="scheduled">Scheduled Room</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {roomType === "scheduled" && (
          <div className="space-y-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2 items-center">
              <Select
                value={time.split(":")[0] || ""}
                onValueChange={(hour) => {
                  const [_, min] = time.split(":");
                  setTime(`${hour}:${min || "00"}`);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Hour">
                    <div className="flex items-center">
                      <ClockIcon className="mr-2 h-4 w-4" />
                      {time.split(":")[0] || "Hour"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={hour} value={hour}>
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-lg">:</span>

              <Select
                value={time.split(":")[1] || ""}
                onValueChange={(minute) => {
                  const [hour] = time.split(":");
                  setTime(`${hour || "00"}:${minute}`);
                }}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Minute">
                    {time.split(":")[1] || "Minute"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <Button
          className="w-full bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
          onClick={handleCreateRoom}
          size="lg"
          disabled={roomType === "scheduled" && (!date || !time)}
        >
          {roomType === "instant" ? "Create Instant Room" : "Schedule Room"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Page() {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-1/2 p-8 flex items-center justify-center relative">
        <RoomForm />
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
