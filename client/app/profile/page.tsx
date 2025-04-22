"use client";
import Header from "@/components/common/Header";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  IconMail,
  IconClock,
  IconBriefcase,
  IconEdit,
  IconCalendar,
  IconMapPin,
} from "@tabler/icons-react";
import { format } from "date-fns";
import ActiveRooms from "@/components/profile/ActiveRooms";

const ProfilePage = () => {
  const profile = useSelector((state: RootState) => state.profile);
  const { status } = useSession();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <div className="h-48 bg-gradient-to-b from-[#00E87B]/20 to-zinc-900" />
          <div className="container mx-auto px-4 -mt-24">
            <div className="max-w-5xl mx-auto">
              <div className="backdrop-blur-sm bg-zinc-900/90 rounded-2xl p-6 mb-6 shadow-xl border border-zinc-800">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  <div className="relative shrink-0">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl bg-zinc-800 animate-pulse" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="space-y-4">
                      <div className="h-8 bg-zinc-800 rounded animate-pulse w-48" />
                      <div className="h-4 bg-zinc-800 rounded animate-pulse w-32" />
                      <div className="h-16 bg-zinc-800 rounded animate-pulse w-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5"
                  >
                    <div className="h-6 bg-zinc-700 rounded animate-pulse w-24 mb-2" />
                    <div className="h-5 bg-zinc-700 rounded animate-pulse w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="h-48 bg-gradient-to-b from-[#00E87B]/30 to-[#111111]" />

        <div className="container mx-auto px-4 -mt-24">
          <div className="max-w-5xl mx-auto">
            <div className="backdrop-blur-sm bg-zinc-900/90 rounded-2xl p-6 mb-6 shadow-xl border border-zinc-800">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden ring-2 ring-[#00E87B]/30">
                    <Image
                      src={profile.profilePicture || "/default-avatar.png"}
                      alt={profile.fullName}
                      width={144}
                      height={144}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    className="absolute -bottom-2 -right-2 p-2 rounded-lg
                             bg-[#00E87B] hover:bg-[#00E87B]/90 text-zinc-900
                             shadow-lg transition-all duration-200"
                  >
                    <IconEdit size={16} />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
                        {profile.fullName}
                      </h1>
                      <div className="flex items-center justify-center sm:justify-start gap-3 text-sm text-[#00E87B]">
                        <span>@{profile.username}</span>
                      </div>
                    </div>

                    <p className="text-sm opacity-80 max-w-2xl">
                      {profile.bio || "No bio added yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <InfoCard
                icon={<IconMail size={20} />}
                label="Email"
                value={profile.email}
              />
              <InfoCard
                icon={<IconBriefcase size={20} />}
                label="Role"
                value={profile.role}
                capitalize
              />
              <InfoCard
                icon={<IconCalendar size={20} />}
                label="Joined"
                value={formatDate(profile.createdAt)}
              />
              <InfoCard
                icon={<IconClock size={20} />}
                label="Last Updated"
                value={formatDate(profile.updatedAt)}
              />
            </div>
            <ActiveRooms />
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) => (
  <div className="bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5 hover:bg-zinc-800/40 transition-all border border-zinc-800">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-[#00E87B]">{icon}</div>
      <p className="text-sm text-[#00E87B]">{label}</p>
    </div>
    <p className={`${capitalize ? "capitalize" : ""} opacity-90`}>
      {value || "-"}
    </p>
  </div>
);

export default ProfilePage;
