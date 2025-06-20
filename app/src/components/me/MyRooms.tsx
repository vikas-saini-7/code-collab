import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { createRoom, deleteRoom, getRooms } from "@/services/room-services";
import { Calendar, PlusCircle, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { IconCopy, IconTrash } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";

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

    const res = await getRooms(session?.user?.id || "");

    if (res?.status === 200) {
      setRooms(res.data);
    } else {
      console.error("Failed to fetch rooms");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      handleGetRoom();
    }
  }, [status]);

  const handleCreateRoom = async (roomType: string) => {
    if (roomType === "scheduled") {
      toast.info("This feature is under development!");
      return;
    }
    // Creating instant room
    const res = await createRoom();
    if (res?.status === 201) {
      setRooms((prev) => [...prev, res.data]);
      toast.success("Room created successfully!");
    } else {
      toast.error("Failed to create room. Please try again.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const res = await deleteRoom(roomId);
    if (res?.status === 200) {
      setRooms((prev) => prev.filter((room) => room.roomId !== roomId));
      toast.success("Room deleted successfully!");
    } else {
      toast.error("Failed to delete room. Please try again.");
    }
  };

  const handleCopy = (roomId: string) => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    toast.success("Share Link copied to clipboard!");
  };

  return (
    <Card>
      {/* Create Room Button  */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Rooms</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="cursor-pointer">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Room
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => handleCreateRoom("instant")}
              className="flex items-center gap-2 cursor-pointer py-2 px-3 hover:bg-muted/80"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <div>
                <p className="font-medium">Instant Room</p>
                <p className="text-xs text-muted-foreground">
                  Create a room now
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleCreateRoom("scheduled")}
              className="flex items-center gap-2 cursor-pointer py-2 px-3 hover:bg-muted/80 opacity-30"
            >
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">Scheduled Room</p>
                <p className="text-xs text-muted-foreground">Plan for later</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                <div className="flex items-center justify-between gap-4">
                  {/* DELETE  */}
                  <Button
                    className="cursor-pointer"
                    variant="ghost"
                    onClick={() => handleDeleteRoom(room.roomId)}
                    size="sm"
                  >
                    <IconTrash className="text-destructive" />
                  </Button>
                  {/* SHARE  */}
                  <Button
                    className="cursor-pointer text-white/70"
                    variant="ghost"
                    onClick={() => handleCopy(room.roomId)}
                    size="sm"
                  >
                    <IconCopy />
                  </Button>
                  {room.status === "active" ? (
                    <Link href={`/room/${room.roomId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                      >
                        Go to Room
                      </Button>
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>
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

// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useSession } from "next-auth/react";
// import { createRoom, deleteRoom, getRooms } from "@/services/room-services";
// import { PlusCircle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { IconTrash } from "@tabler/icons-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface Room {
//   roomId: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   status: string;
// }

// const MyRooms = () => {
//   const { data: session, status } = useSession();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [scheduledModalOpen, setScheduledModalOpen] = useState(false);
//   const [scheduledRoomData, setScheduledRoomData] = useState({
//     name: "",
//     scheduledDate: "",
//     scheduledTime: "",
//   });

//   const handleGetRoom = async () => {
//     setIsLoading(true);
//     try {
//       const res = await getRooms(session?.user?.id || "");
//       if (res?.status === 200) {
//         setRooms(res.data);
//       } else {
//         console.error("Failed to fetch rooms");
//       }
//     } catch (error) {
//       console.error("Error fetching rooms:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (status === "authenticated") {
//       handleGetRoom();
//     }
//   }, [status]);

//   const handleCreateInstantRoom = async () => {
//     const res = await createRoom();
//     if (res?.status === 201) {
//       setRooms((prev) => [...prev, res.data]);
//       toast.success("Room created successfully!");
//     } else {
//       toast.error("Failed to create room. Please try again.");
//     }
//   };

//   const openScheduledModal = () => {
//     toast.info("This feature is under development!");
//     return
//     setScheduledModalOpen(true);
//   };

//   const handleScheduledInputChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setScheduledRoomData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCreateScheduledRoom = async () => {
//     toast.success("This feature is under development!");
//   };

//   const handleDeleteRoom = async (roomId: string) => {
//     const res = await deleteRoom(roomId);
//     if (res?.status === 200) {
//       setRooms((prev) => prev.filter((room) => room.roomId !== roomId));
//       toast.success("Room deleted successfully!");
//     } else {
//       toast.error("Failed to delete room. Please try again.");
//     }
//   };

//   return (
//     <Card>
//       {/* Create Room Button with Dropdown */}
//       <CardHeader className="flex flex-row items-center justify-between">
//         <CardTitle>My Rooms</CardTitle>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button size="sm" className="cursor-pointer">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               New Room
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem onClick={handleCreateInstantRoom}>
//               Instant Room
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={openScheduledModal}>
//               Scheduled Room
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </CardHeader>

//       {/* Rooms list */}
//       <CardContent>
//         {isLoading ? (
//           <div className="grid gap-4">
//             {/* Display 3 skeleton items while loading */}
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="flex items-center justify-between p-4 border rounded-md"
//               >
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-[120px]" />
//                   <div className="flex items-center gap-4">
//                     <Skeleton className="h-3 w-[180px]" />
//                     <Skeleton className="h-3 w-[60px]" />
//                   </div>
//                 </div>
//                 <Skeleton className="h-8 w-[80px]" />
//               </div>
//             ))}
//           </div>
//         ) : rooms.length > 0 ? (
//           <div className="grid gap-4">
//             {rooms.map((room, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors"
//               >
//                 <div>
//                   <h3 className="font-medium">{room.name}</h3>
//                   <div className="flex items-center gap-4">
//                     <p className="text-sm text-muted-foreground">
//                       {room.roomId}
//                     </p>
//                     <p
//                       className={`text-sm ${
//                         room.status === "active"
//                           ? "text-green-500"
//                           : "text-muted-foreground"
//                       }`}
//                     >
//                       {room.status}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between gap-4">
//                   <Button
//                     className="cursor-pointer"
//                     variant="ghost"
//                     onClick={() => handleDeleteRoom(room.roomId)}
//                     size="sm"
//                   >
//                     <IconTrash />
//                   </Button>
//                   {room.status === "active" ? (
//                     <Link href={`/room/${room.roomId}`}>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="cursor-pointer"
//                       >
//                         Go to Room
//                       </Button>
//                     </Link>
//                   ) : (
//                     <div></div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <p className="text-muted-foreground">
//               You haven't created any rooms yet.
//             </p>
//           </div>
//         )}
//       </CardContent>

//       {/* Scheduled Room Modal */}
//       <Dialog open={scheduledModalOpen} onOpenChange={setScheduledModalOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Schedule a Room</DialogTitle>
//             <DialogDescription>
//               Set the details for your scheduled room. Click save when you're
//               done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="name" className="text-right">
//                 Room Name
//               </Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={scheduledRoomData.name}
//                 onChange={handleScheduledInputChange}
//                 className="col-span-3"
//                 placeholder="My Scheduled Room"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="scheduledDate" className="text-right">
//                 Date
//               </Label>
//               <Input
//                 id="scheduledDate"
//                 name="scheduledDate"
//                 type="date"
//                 value={scheduledRoomData.scheduledDate}
//                 onChange={handleScheduledInputChange}
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="scheduledTime" className="text-right">
//                 Time
//               </Label>
//               <Input
//                 id="scheduledTime"
//                 name="scheduledTime"
//                 type="time"
//                 value={scheduledRoomData.scheduledTime}
//                 onChange={handleScheduledInputChange}
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="secondary"
//               onClick={() => setScheduledModalOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="button" onClick={handleCreateScheduledRoom}>
//               Schedule Room
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default MyRooms;
