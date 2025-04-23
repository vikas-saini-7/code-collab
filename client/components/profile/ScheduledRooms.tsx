import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Copy, Code, Users, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { IconBrandWhatsapp } from "@tabler/icons-react";

interface Room {
  _id: string;
  roomId: string;
  name: string;
  type: string;
  description: string;
  status: string;
  maxParticipants: number;
  timeZone: string;
  host: string;
  joinLink: string;
  configuration: {
    chatEnabled: boolean;
  };
  permissions: {
    codeEdit: string;
    allowedEditors: string[];
  };
  participants: {
    user: string;
    joinedAt: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const ScheduledRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/scheduled-rooms`,
        { withCredentials: true }
      );
      setRooms(response.data.data);
      console.log("Scheduled rooms:", response.data.data);
      // setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error("Failed to load scheduled rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const copyJoinLink = (joinLink: string) => {
    navigator.clipboard.writeText(joinLink);
    toast.success("Join link copied to clipboard");
  };

  const handleWhatsAppShare = (room: Room) => {
    const message = `Join my Code Collab room: ${room.name}. Click here: ${room.joinLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5 hover:bg-zinc-800/40 transition-all border border-zinc-800 w-full md:w-1/2 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-[#ff8b32] mr-2">●</span>
        Scheduled Rooms
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#00E87B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-zinc-400 py-10 text-center flex flex-col items-center">
          <Calendar size={40} className="text-zinc-500 mb-3" />
          <p>No scheduled rooms found</p>
          <p className="text-sm mt-1 text-zinc-500">
            Schedule a new room to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-[#ff8b32]/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex justify-between items-start">
                <h3 className="font-medium text-lg group-hover:text-[#ff8b32] transition-colors">
                  {room.name}
                </h3>
              </div>

              {room.description && (
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                  {room.description}
                </p>
              )}

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center text-zinc-400">
                  <Users size={14} className="mr-1.5" />
                  <span>Participants:</span>
                  <span className="ml-auto text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-full text-xs">
                    {room.participants.length}/{room.maxParticipants}
                  </span>
                </div>

                <div className="flex items-center text-zinc-400">
                  <Calendar size={14} className="mr-1.5" />
                  <span>Created:</span>
                  <span className="ml-auto text-zinc-300">
                    {formatDate(room.createdAt)}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {/* {room.joinLink && ( */}
                <Button
                  onClick={() => copyJoinLink(room.joinLink)}
                  variant="outline"
                  size="sm"
                  className="text-zinc-300 border-zinc-700 hover:bg-zinc-700 transition-colors bg-transparent"
                >
                  <Copy size={14} className="mr-1.5" />
                  Copy Link
                </Button>
                {/* )} */}

                <Button
                  onClick={() => handleWhatsAppShare(room)}
                  size="sm"
                  className="bg-[#00E87B] hover:bg-[#00E87B]/80 text-black font-medium transition-colors"
                >
                  <IconBrandWhatsapp />
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledRooms;
