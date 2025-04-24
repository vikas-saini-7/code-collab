"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { changeFontSize, changeTheme } from "@/redux/reducers/settingsReducer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useRoomContext } from "@/providers/roomContextProvider";
import { Settings, Users, Code, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

const page: React.FC = () => {
  const dispatch = useAppDispatch();
  const { roomData, loading, error } = useRoomContext();
  const { data: session, status } = useSession();

  const fontSize = useAppSelector((item) => item.settings.fontSize);
  const theme = useAppSelector((item) => item.settings.theme);

  // Host settings state
  const [chatEnabled, setChatEnabled] = useState(true);
  const [codeEditPermission, setCodeEditPermission] = useState("host");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isSaving, setIsSaving] = useState(false);

  // Original values for comparison
  const [originalChatEnabled, setOriginalChatEnabled] = useState(true);
  const [originalCodeEditPermission, setOriginalCodeEditPermission] =
    useState("host");
  const [originalMaxParticipants, setOriginalMaxParticipants] = useState(10);

  const [isHost, setIsHost] = useState(false);

  // Check if the user is the host
  useEffect(() => {
    const userId = session?.user?.id;
    const hostId = roomData?.host;
    if (userId && hostId) {
      const hostStatus = userId === hostId;
      setIsHost(hostStatus);
    }
  }, [roomData, session]);

  // initial data
  useEffect(() => {
    if (roomData) {
      const chatEnabledValue = roomData.configuration?.chatEnabled ?? true;
      const codeEditValue = roomData.permissions?.codeEdit ?? "host";
      const maxParticipantsValue = roomData.maxParticipants ?? 10;

      setChatEnabled(chatEnabledValue);
      setCodeEditPermission(codeEditValue);
      setMaxParticipants(maxParticipantsValue);

      // Set original values for comparison
      setOriginalChatEnabled(chatEnabledValue);
      setOriginalCodeEditPermission(codeEditValue);
      setOriginalMaxParticipants(maxParticipantsValue);
    }
  }, [roomData]);

  // Check if settings have changed from their original values
  const hasSettingsChanged = () => {
    return (
      chatEnabled !== originalChatEnabled ||
      codeEditPermission !== originalCodeEditPermission ||
      maxParticipants !== originalMaxParticipants
    );
  };

  const fontSizeOptions = Array.from({ length: 11 }, (_, i) => 10 + i * 2);
  const themeOptions = [
    "light",
    "dark",
    "github",
    "material",
    "dracula",
    "solarized",
  ];

  const editPermissionOptions = [
    { value: "host", label: "Host only" },
    { value: "selected", label: "Selected participants" },
    { value: "all", label: "All participants" },
  ];

  const handleFontSizeChange = (size: string) => {
    dispatch(changeFontSize(parseInt(size)));
  };

  const handleThemeChange = (selectedTheme: string) => {
    dispatch(changeTheme(selectedTheme));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedSettings = {
        configuration: { chatEnabled },
        permissions: { codeEdit: codeEditPermission },
        maxParticipants,
        roomId: roomData?.roomId,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room/update-settings`,
        updatedSettings,
        { withCredentials: true }
      );

      // Update original values after successful save
      setOriginalChatEnabled(chatEnabled);
      setOriginalCodeEditPermission(codeEditPermission);
      setOriginalMaxParticipants(maxParticipants);

      toast.success("Settings saved successfully");
    } catch (err) {
      console.error("Error Saving Settings:", err);
      toast.error("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-pulse text-gray-500">Loading settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mx-auto max-w-md mt-8">
        Error loading room settings: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-6 px-4 space-y-4">
      {/* Host Settings Card */}
      {isHost && (
        <div className="">
          <div className="border-b p-5 pt-0 flex items-center gap-3">
            <Settings size={18} className="h-5 w-5 text-emerald-500" />
            <h2 className="">Host Settings</h2>
          </div>

          <div className="p-5 space-y-6">
            {/* Chat Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="chat-enabled"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Enable Chat
                </Label>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Allow participants to communicate via chat
              </p> */}
              </div>
              <Switch
                id="chat-enabled"
                checked={chatEnabled}
                onCheckedChange={setChatEnabled}
                className="data-[state=checked]:bg-emerald-500"
                disabled={isSaving}
              />
            </div>

            {/* Code Edit Permissions */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Code className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Code Edit Permissions
                </Label>
              </div>
              <Select
                value={codeEditPermission}
                onValueChange={setCodeEditPermission}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select permission level" />
                </SelectTrigger>
                <SelectContent>
                  {editPermissionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Participants */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Max Participants
                  </Label>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {maxParticipants}
                </span>
              </div>
              <Slider
                value={[maxParticipants]}
                min={2}
                max={50}
                step={1}
                onValueChange={(value) => setMaxParticipants(value[0])}
                className="my-1"
                disabled={isSaving}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>2</span>
                <span>50</span>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className={`w-full py-5 rounded-lg transition-colors ${
                hasSettingsChanged() && !isSaving
                  ? "bg-[#00E87B] hover:bg-[#00E87B] text-black font-bold opacity-100"
                  : "cursor-not-allowed"
              }`}
              disabled={!hasSettingsChanged() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Editor Settings Card */}
      <div className="">
        <div className="border-b p-5 pt-0 flex items-center gap-3">
          <Code size={18} className="h-5 w-5 text-emerald-500" />
          <h2 className="">Editor Settings</h2>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themeOptions.map((themeOption) => (
                  <SelectItem key={themeOption} value={themeOption}>
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Size
            </Label>
            <Select
              value={fontSize.toString()}
              onValueChange={handleFontSizeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
