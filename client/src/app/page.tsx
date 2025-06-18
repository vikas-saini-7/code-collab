import { Header } from "@/components/Header";
import { Dot } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen">
      <Header />
      <div className="flex items-center justify-center text-center h-[80vh]">
        <div>
          <h1 className="text-9xl font-bold">Code Collab</h1>
          {/* <div className="flex items-center justify-center">
          <p>Code Together</p>
          <Dot />
          <p>Work Together</p>
        </div> */}
        </div>
      </div>
    </div>
  );
}
