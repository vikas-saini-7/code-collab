"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback } from "react";
import debounce from "lodash/debounce";

const OnboardingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [otherRole, setOtherRole] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!username || !selectedRole || !experienceLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedRole === "other" && !otherRole) {
      toast.error("Please specify your role");
      return;
    }

    setIsLoading(true);

    try {
      const loadingToast = toast.loading("Saving profile...");

      const formData = {
        username,
        role: selectedRole === "other" ? otherRole : selectedRole,
        experienceLevel,
        bio,
        isPublic,
        profilePicture: profileImage,
      };

      const response = await axios.post("/api/onboard", formData);

      if (response.data.success) {
        toast.success("Profile saved successfully!", {
          id: loadingToast,
        });
        router.push("/create-room");
      } else {
        throw new Error(response.data.error || "Failed to save profile");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong",
        {
          duration: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setIsUsernameAvailable(null);
        return;
      }

      setIsCheckingUsername(true);
      try {
        const response = await axios.get(
          `/api/check-username?username=${username}`
        );
        setIsUsernameAvailable(response.data.available);
      } catch (error) {
        console.error("Error checking username:", error);
        setIsUsernameAvailable(null);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500),
    []
  );

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto bg-[#171717]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Complete Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileImage} />
                <AvatarFallback>Upload</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="max-w-[200px]"
              />
            </div>

            {/* Username  */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    checkUsername(e.target.value);
                  }}
                  className={`${
                    isUsernameAvailable === true
                      ? "border-[#00E87B]"
                      : isUsernameAvailable === false
                      ? "border-red-500"
                      : ""
                  }`}
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCheckingUsername && (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="#00E87B"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="#00E87B"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {!isCheckingUsername && isUsernameAvailable === true && (
                    <span className="text-[#00E87B]">✓</span>
                  )}
                  {!isCheckingUsername && isUsernameAvailable === false && (
                    <span className="text-red-500">✗</span>
                  )}
                </div>
              </div>
              {!isCheckingUsername && isUsernameAvailable === false && (
                <p className="text-sm text-red-500">
                  This username is already taken
                </p>
              )}
            </div>
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => setSelectedRole(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">
                    Full Stack Developer
                  </SelectItem>
                  <SelectItem value="devops">DevOps Engineer</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {selectedRole === "other" && (
                <div className="mt-2">
                  <Input
                    type="text"
                    placeholder="Please specify your role"
                    value={otherRole}
                    onChange={(e) => setOtherRole(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
            {/* Experience Level */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <Select
                onValueChange={(value) => setExperienceLevel(value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">
                Bio <span className="text-sm text-gray-500">(optional)</span>
              </Label>
              <Textarea
                placeholder="Write a short introduction about yourself... (optional)"
                className="resize-none"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            {/* Public Profile Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="public-profile">Public Profile</Label>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                id="public-profile"
              />
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;
