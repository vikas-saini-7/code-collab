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
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IconChevronCompactDown, IconChevronDown } from "@tabler/icons-react";

const RoomForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [roomType, setRoomType] = useState<"instant" | "scheduled">("instant");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adSetVisible, setAdSetVisible] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Add this type definition at the top of your file, after imports
  interface IRoomData {
    name: string;
    type: "instant" | "scheduled";
    description: string;
    maxParticipants: number;
    scheduledAt?: string;
  }

  const createRoomOnServer = async () => {
    try {
      // Prepare room data based on form state
      const roomData: IRoomData = {
        name: name || "Untitled Room",
        type: roomType,
        description: description,
        maxParticipants: maxParticipants,
        // configuration: {
        //   chatEnabled: true,
        // },
        // permissions: {
        //   codeEdit: "host",
        //   allowedEditors: [],
        // },
      };

      // Add scheduled room specific fields if type is scheduled
      if (roomType === "scheduled" && date && time) {
        const scheduledTime = new Date(date);
        const [hours, minutes] = time.split(":");
        scheduledTime.setHours(parseInt(hours), parseInt(minutes));

        roomData.scheduledAt = scheduledTime.toISOString();
      }

      console.log(roomData);
      // return;

      // Make the POST request to create the room
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room`,
        roomData,
        { withCredentials: true }
      );

      console.log("Room created successfully:", response.data);
      return response.data.data._id; // Return server generated ID
    } catch (err) {
      console.error("Error creating room:", err);
      throw new Error("Failed to create room on server");
    }
  };

  const handleCreateRoom = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Create room on server and get the server-generated ID
      const serverRoomId = await createRoomOnServer();
      return;

      // Update redux state and navigate
      dispatch(setRoomId(serverRoomId));
      router.push(`/room/${serverRoomId}/files`);
    } catch (error) {
      console.error("Failed to create room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#171717] border-[#2A2A2A]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create a Room</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name (optional)</Label>
            <Input
              id="name"
              placeholder="Enter room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#2A2A2A] border-[#3A3A3A]"
            />
          </div>

          <div className="space-y-2">
            <Label>Room Type</Label>
            <Select
              value={roomType}
              onValueChange={(value: "instant" | "scheduled") =>
                setRoomType(value)
              }
            >
              <SelectTrigger className="bg-[#2A2A2A] border-[#3A3A3A]">
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant Room</SelectItem>
                <SelectItem value="scheduled">Scheduled Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {roomType === "scheduled" && (
          <div className="space-y-4">
            <Label>Schedule Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-[#2A2A2A] border-[#3A3A3A]"
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
                <SelectTrigger className="w-[110px] bg-[#2A2A2A] border-[#3A3A3A]">
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
                <SelectTrigger className="w-[110px] bg-[#2A2A2A] border-[#3A3A3A]">
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

        {adSetVisible && (
          <>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this room"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#2A2A2A] border-[#3A3A3A]"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants (max 50)</Label>
              <Input
                id="maxParticipants"
                type="number"
                min={2}
                max={50}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                className="bg-[#2A2A2A] border-[#3A3A3A]"
              />
            </div>
          </>
        )}

        {/* advanced Settings toggler  */}
        <div className="flex items-center gap-2 text-sm text-white/50 cursor-pointer hover:text-[#00E87B] transition-all duration-300 w-fit">
          <div
            className="flex items-center"
            onClick={() => setAdSetVisible((prev) => !prev)}
          >
            {/* {adSetVisible ? <span>Hide </span> : <span>Show </span>}&nbsp; */}
            {/* <IconChevronDown
              size={18}
              className={`transition-transform duration-300 ${
                adSetVisible ? "rotate-180" : ""
              }`}
            /> */}
            Advanced Settings
            <IconChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                adSetVisible ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="w-full bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
          onClick={handleCreateRoom}
          size="lg"
          disabled={
            (roomType === "scheduled" && (!date || !time)) || isSubmitting
          }
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner /> Creating...
            </span>
          ) : roomType === "instant" ? (
            "Create Instant Room"
          ) : (
            "Schedule Room"
          )}
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
