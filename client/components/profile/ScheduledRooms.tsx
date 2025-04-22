import React, { useState, useEffect } from "react";
import axios from "axios";

interface Room {
  _id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  maxParticipants: number;
  participants: {
    user: string;
    joinedAt: string;
    _id: string;
  }[];
  createdAt: string;
  // Add other room properties as needed
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
      // setError("Failed to load Scheduled rooms");
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

  return (
    <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5 hover:bg-zinc-800/40 transition-all border border-zinc-800 w-1/2 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="text-[#ff8b32] mr-2">●</span>
        Scheduled Rooms
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#00E87B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-zinc-400 py-6 text-center">
          No Scheduled rooms found
        </p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-[#00E87B]/70 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="font-medium text-lg group-hover:text-[#00E87B] transition-colors">
                {room.name}
              </h3>

              <div className="mt-3 space-y-2 text-sm text-zinc-400">
                <div className="flex justify-between items-center">
                  <span>Participants</span>
                  <span className="text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded-full text-xs">
                    {room.participants.length}/{room.maxParticipants}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-zinc-300">
                    {formatDate(room.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledRooms;
