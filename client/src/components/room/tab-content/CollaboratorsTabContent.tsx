import React from "react";
import { useSocket } from "@/providers/SocketProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconUser } from "@tabler/icons-react";

const CollaboratorsContent = () => {
  const { collaborators } = useSocket();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium">
          Collaborators ({collaborators?.length || 0})
        </h2>
      </div>

      <ScrollArea className="flex-1">
        {collaborators && collaborators.length > 0 ? (
          <div className="p-4 space-y-3">
            {collaborators.map((user) => (
              <div
                key={user?._id}
                className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                  user?._id === currentUserId
                    ? "bg-muted/50 border border-border/50"
                    : "hover:bg-muted/30"
                }`}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={user?.name} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <IconUser size={14} />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex items-center justify-between">
                  <p className="text-sm capitalize">
                    {user.name}
                    {user._id === currentUserId && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-2 bg-green-500/10 text-green-500 border-green-500/20"
                  >
                    Online
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-8">
            No one is currently in this room
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default CollaboratorsContent;
