import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col w-screen h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter">
            Code Collab<span className="text-[#00E87B]">.</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Collaborate on code in real-time
          </p>
          <div className="mt-6">
            <Link href="create-room">
              <Button className="mt-8">Create Room Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
