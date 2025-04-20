"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      // Basic input validation
      if (!email.trim() || !password.trim()) {
        toast.error("Please fill in all fields", { id: toastId });
        setLoading(false);
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address", { id: toastId });
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error cases
        switch (result.error) {
          case "CredentialsSignin":
            toast.error("Invalid email or password", { id: toastId });
            break;
          case "EmailNotVerified":
            toast.error("Please verify your email first", { id: toastId });
            break;
          case "AccountDisabled":
            toast.error("Your account has been disabled", { id: toastId });
            break;
          default:
            toast.error("Authentication failed", { id: toastId });
        }
      } else {
        toast.success("Signed in successfully!", { id: toastId });
        router.push("/create-room");
        router.refresh();
      }
    } catch (error: any) {
      // Handle network or unexpected errors
      if (error.message === "Network Error") {
        toast.error(
          "Unable to connect to the server. Please check your internet connection.",
          { id: toastId }
        );
      } else if (error.response?.status === 429) {
        toast.error("Too many login attempts. Please try again later.", {
          id: toastId,
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.", {
          id: toastId,
        });
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in will be available soon!");
  };

  const handleGithubSignIn = () => {
    toast.info("GitHub sign-in will be available soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#171717]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <IconBrandGoogle size={20} />
              Sign in with Google
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGithubSignIn}
            >
              <IconBrandGithub size={20} />
              Sign in with GitHub
            </Button>
          </div>

          <div className="my-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-2 text-sm text-gray-400">OR</span>
            <Separator className="flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#00E87B] font-medium">
              Sign up here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
