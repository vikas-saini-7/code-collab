import React, { useState, useEffect } from "react";
import axios from "axios";

interface Room {
  id: string;
  name: string;
  // Add other room properties as needed
}

const ActiveRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/active-rooms`,
        { withCredentials: true }
      );
      setRooms(response.data);
      console.log("Active rooms:", response.data);
      // setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      // setError("Failed to load active rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="mb-6 ">
      <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5 hover:bg-zinc-800/40 transition-all border border-zinc-800">
        {/* {loading ? (
          <p>Loading rooms...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>{room.name}</li>
            ))}
          </ul>
        ) : (
          <p>No active rooms found</p>
        )} */}
      </div>
    </div>
  );
};

export default ActiveRooms;
