"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
export default function RoomMenu() {
  const [roomCode, setRoomCode] = useState("");
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <Link className="w-full" href={`/tier-list/${roomCode}`}>
          <Button className="w-full">Join a Room</Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <p className="text-sm text-muted-foreground">or</p>
        <Separator className="flex-1" />
      </div>
      <Link href="tier-list/create">
        <Button className="w-full">Create a Room</Button>
      </Link>
    </div>
  );
}
