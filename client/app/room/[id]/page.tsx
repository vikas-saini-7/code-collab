"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const page: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const roomIdFromUrl = pathname.split("/")[2];
    router.push("/room/" + roomIdFromUrl + "/files");
  }, []);
  return <></>;
};

export default page;
