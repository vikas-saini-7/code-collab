// "use client";
// import { useState } from "react";
// import { setUsername } from "@/redux/reducers/userReducer";
// import { useAppDispatch } from "@/redux/store";
// import Link from "next/link";
// import { setRoomId } from "@/redux/reducers/roomReducer";

// export default function Home() {
//   const dispatch = useAppDispatch();

//   // store

//   // local
//   const [name, setName] = useState("");
//   const [room, setRoom] = useState("");

//   // handlers
//   const handleSetDetails = () => {
//     dispatch(setUsername(name));
//     dispatch(setRoomId(room));
//   };

//   const generateRandomRoomId = () => {
//     const generateSegment = () => {
//       return Math.random().toString(36).substring(2, 5);
//     };

//     return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
//   };

//   const HandleGenerateRandomRoomId = () => {
//     const uniqueRoomId = generateRandomRoomId();
//     setRoom(uniqueRoomId);
//   };

//   return (
//     <div className=" flex flex-col md:flex-row w-full h-screen bg-[#181926]">
//       {/* left  */}
//       <div className="md:flex-1 py-24 flex gap-2 items-center justify-center">
//         {/* <IconCodeCircle2Filled size={32}/> */}
//         <h1 className="font-bold text-3xl md:text-5xl text-lg:7xl">
//           Code Collab<span className="text-purple-400">.</span>
//         </h1>
//       </div>

//       {/* right  */}
//       <div className="flex-1 flex items-start md:items-center justify-center bg-[#1f2130]">
//         <div className="flex flex-col space-y-4 w-full max-w-sm px-4">
//           <h1 className="font-bold mt-4 md:mt-0">Enter in a room</h1>
//           <input
//             className="h-9 rounded px-3 text-black"
//             type="text"
//             placeholder="Your Name"
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             onChange={(e) => setRoom(e.target.value)}
//             className="h-9 rounded px-3 text-black"
//             type="text"
//             placeholder="Room Id"
//             value={room}
//           />
//           <Link href={`/${room}/files`}>
//             <button
//               disabled={room === "" || name === ""}
//               onClick={handleSetDetails}
//               className={`${
//                 (room === "" || name === "") && "opacity-20"
//               }  w-full h-9 rounded bg-purple-400 hover:bg-purple-500 font-bold text-xl text-black`}
//             >
//               Start
//             </button>
//           </Link>
//           <p
//             onClick={HandleGenerateRandomRoomId}
//             className="text-blue-400 cursor-pointer"
//           >
//             Generate unique Room Id
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { setUsername } from "@/redux/reducers/userReducer";
import { useAppDispatch } from "@/redux/store";
import Link from "next/link";
import { setRoomId } from "@/redux/reducers/roomReducer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const handleSetDetails = () => {
    dispatch(setUsername(name));
    dispatch(setRoomId(room));
  };

  const generateRandomRoomId = () => {
    const generateSegment = () => {
      return Math.random().toString(36).substring(2, 5);
    };
    return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  };

  const HandleGenerateRandomRoomId = () => {
    setRoom(generateRandomRoomId());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          Code Collab<span className="text-[#00E87B]">.</span>
        </h1>
        <p className="text-muted-foreground">
          Collaborate on code in real-time
        </p>
      </div>

      {/* Form Section */}
      <Card className="w-full max-w-md mx-auto bg-[#171717]">
        <CardHeader>
          <CardTitle className="text-2xl">Join a Room</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          {room && name ? (
            <Link href={`/${room}/files`} className="w-full block">
              <Button className="w-full" onClick={handleSetDetails} size="lg">
                Start Collaboration
              </Button>
            </Link>
          ) : (
            <Button className="w-full" disabled size="lg">
              Start Collaboration
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full"
            onClick={HandleGenerateRandomRoomId}
          >
            Generate Random Room ID
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
