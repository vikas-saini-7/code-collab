"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconBrandWhatsapp, IconCopy, IconShare } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";

const RoomForm = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);
  const [roomType, setRoomType] = useState<"instant" | "scheduled">("instant");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adSetVisible, setAdSetVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<IRoomResponse | null>(null);

  // Generate default room name using username and a random word
  useEffect(() => {
    if (profile.username) {
      const randomWords = [
        "Session",
        // "Hub",
        "Space",
        "Room",
        // "Lab",
        // "Workshop",
        // "Studio",
        "Project",
        "Collab",
        "Zone",
        "Arena",
      ];
      const randomWord =
        randomWords[Math.floor(Math.random() * randomWords.length)];
      const defaultName = `${profile.fullName}'s ${randomWord}`;
      setName(defaultName);
    }
  }, [profile.username]);

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
  interface IRoomResponse {
    _id: string;
    roomId: string;
    name: string;
    type: "instant" | "scheduled";
    description: string;
    host: string;
    status: string;
    maxParticipants: number;
    scheduledAt?: string;
    participants: Array<any>;
    configuration: {
      chatEnabled: boolean;
    };
    permissions: {
      codeEdit: string;
      allowedEditors: Array<any>;
    };
    joinLink: string;
    timeZone: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  const createRoomOnServer = async () => {
    try {
      // Prepare room data based on form state
      const roomData: IRoomData = {
        name: name || `${profile.username}'s Room`,
        type: roomType,
        description: description,
        maxParticipants: maxParticipants,
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
      return response.data.data; // Return server generated ID
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
      const serverRoom = await createRoomOnServer();
      setCreatedRoom(serverRoom);

      if (serverRoom.type === "scheduled") {
        console.log("Server room is Scheduled:", serverRoom);
        // Show modal for scheduled rooms
        setIsModalOpen(true);
      } else {
        console.log("Server room is instant:", serverRoom);
        // Redirect directly to the room for instant rooms
        router.push(`/room/${serverRoom.roomId}`);
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      setError("Failed to create room. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP 'at' h:mm a");
  };

  // Add copy link function
  const handleCopyLink = () => {
    if (!createdRoom) return;
    navigator.clipboard.writeText(createdRoom.joinLink);
    toast.success("Link copied!");
  };

  // Add WhatsApp share function
  const handleWhatsAppShare = () => {
    if (!createdRoom) return;
    const message = `Join my Code Collab room: ${createdRoom.name}. Click here: ${createdRoom.joinLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Add general share function using Web Share API
  const handleShare = async () => {
    if (!createdRoom) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join Code Collab: ${createdRoom.name}`,
          text: `Join my Code Collab room: ${createdRoom.name}`,
          url: createdRoom.joinLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink(); // Fallback to copy if Web Share API isn't available
    }
  };

  return (
    <>
      <Card className="w-full max-w-md bg-[#171717] border-[#2A2A2A]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Name</Label>
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
                <Label htmlFor="maxParticipants">
                  Max Participants (max 50)
                </Label>
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
      {/* Success Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#171717] border-[#2A2A2A] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              Room {createdRoom?.type === "scheduled" ? "Scheduled" : "Created"}
              <Badge
                variant="outline"
                className="bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/30"
              >
                {createdRoom?.type === "scheduled" ? "Scheduled" : "Ready"}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {createdRoom?.type === "scheduled"
                ? "Your room has been scheduled successfully"
                : "Your room is ready for collaboration"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Room Name</Label>
              <p className="font-medium">{createdRoom?.name}</p>
            </div>

            {createdRoom?.type === "scheduled" && createdRoom?.scheduledAt && (
              <div className="space-y-2">
                <Label className="text-gray-400">Scheduled At</Label>
                <p className="font-medium">
                  {formatScheduledDate(createdRoom.scheduledAt)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-400">Join Link</Label>
              <div className="flex items-center gap-2 relative">
                <Input
                  value={createdRoom?.joinLink || ""}
                  readOnly
                  className="bg-[#2A2A2A] border-[#3A3A3A] pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyLink}
                  className="absolute right-0 hover:bg-[#2A2A2A] hover:text-[#00E87B]"
                >
                  <IconCopy size={16} />
                </Button>
              </div>
            </div>

            <Separator className="my-4 bg-gray-800" />

            <div className="space-y-2">
              <Label className="text-gray-400">Share</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-2 bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30"
                >
                  <IconBrandWhatsapp size={18} />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-[#2A2A2A] border-[#3A3A3A] hover:bg-[#00E87B]/10 hover:text-[#00E87B] hover:border-[#00E87B]/30"
                >
                  <IconShare size={18} />
                  Share
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            {/* {createdRoom?.type === "instant" ? (
              <Button
                onClick={() => router.push(`/room/${createdRoom.roomId}/files`)}
                className="bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
              >
                Join Room Now
              </Button>
            ) : ( */}
            <Link href="/profile">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#00E87B] hover:bg-[#00c666] text-black font-medium transition-all duration-300"
              >
                Go to Profile
              </Button>
            </Link>
            {/* )} */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
