import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex items-center justify-between container mx-auto py-4 px-4">
      <h1 className="text-2xl font-bold tracking-tighter">
        Code Collab<span className="text-[#00E87B]">.</span>
      </h1>
      <div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
