import {
  IconFiles,
  IconMessage,
  IconMessages,
  IconSettings,
  IconSettings2,
  IconUsers,
  IconVideo,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "files", icon: IconFiles, label: "Files" },
    { href: "people", icon: IconUsers, label: "Collaborators" },
    { href: "chat", icon: IconMessages, label: "Group Chat" },
    { href: "video", icon: IconVideo, label: "Video Chat" },
    { href: "settings", icon: IconSettings2, label: "Settings" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example:
    // localStorage.removeItem("token");
    // router.push("/login");
  };

  return (
    <aside className="flex h-screen w-16 flex-col items-center border-r px-3 py-4 bg-[#171717]">
      <nav className="flex flex-1 flex-col items-center gap-3">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname?.includes(href);
          return (
            <TooltipProvider key={href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md",
                      "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive &&
                        "bg-[#00E87B]/10 text-[#00E87B] hover:bg-[#00E87B]/20 hover:text-[#00E87B]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      {/* Bottom buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="profile"
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-md",
                  "text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  pathname?.includes("profile") &&
                    "bg-[#00E87B]/10 text-[#00E87B] hover:bg-[#00E87B]/20 hover:text-[#00E87B]"
                )}
              >
                <IconUser className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md",
                      "text-muted-foreground transition-colors",
                      "hover:bg-red-500/20 hover:text-red-500",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    <IconLogout className="h-5 w-5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be redirected to the login page. Any unsaved
                      changes may be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-secondary/80">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};

export default SideBar;
